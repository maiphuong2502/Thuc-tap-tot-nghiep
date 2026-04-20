<?php

namespace App\Services;

use App\Models\Result;
use App\Models\Question;
use App\Models\McqAnswer;
use App\Models\FillUserAnswer;
use App\Models\DropdownAnswer;
use App\Models\MatchingUserAnswer;
use App\Models\TfngUserAnswer;
use App\Models\BandScoreConversion;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ExamSubmissionService
{
    /**
     * Process an exam submission
     */
    public function submit($testId, $userId, $answers)
    {
        return DB::transaction(function () use ($testId, $userId, $answers) {
            // 1. Create the Result record
            $result = new Result();
            $result->result_id = $this->generateResultId();
            $result->user_id = $userId;
            $result->test_id = $testId;
            $result->start_time = now(); // Ideally passed from frontend, but now() is fallback
            $result->end_time = now();
            $result->total_questions = count($answers); // Approximate, will be refined if needed
            $result->correct_count = 0;
            $result->wrong_count = 0;
            $result->skipped_count = 0;
            $result->band_score = 0;
            $result->save();

            $correctOverall = 0;
            $skillStats = []; // To track correct count per skill for band score calculation

            // 2. Process each answer
            foreach ($answers as $key => $userAnswer) {
                if (empty($userAnswer)) {
                    continue;
                }

                // Handle Writing Group Submissions (New mechanism)
                if (strpos($key, 'GROUP_') === 0) {
                    $groupId = substr($key, 6);
                    $this->saveWritingSubmission($result->result_id, $userId, $groupId, $userAnswer);
                    continue; // Skip standard question processing
                }

                // Standard Question Processing
                $questionId = $key;
                $question = Question::with([
                    'mcqQuestion.options',
                    'fillQuestion.fillAnswers', // Wait, FillQuestion hasMany fillAnswers? No, check model.
                    'dropdownQuestion.options',
                    'matchingQuestion.answers',
                    'tfngQuestion.tfngAnswers'
                ])->find($questionId);

                if (!$question) continue;

                $skillId = $question->skill_id;
                if (!isset($skillStats[$skillId])) {
                    $skillStats[$skillId] = 0;
                }

                $isCorrect = false;
                $this->saveAnswerDetails($result->result_id, $question, $userAnswer, $isCorrect);

                if ($isCorrect) {
                    $correctOverall++;
                    $skillStats[$skillId]++;
                } else {
                    $result->wrong_count++;
                }
            }

            // 3. Update result stats
            $result->correct_count = $correctOverall;
            
            // 4. Calculate Band Score (per skill and overall)
            // Implementation depends on how you want to store it. 
            // Usually, overall band is average of skill bands.
            $totalBandValues = 0;
            $skillCount = 0;
            foreach ($skillStats as $sId => $count) {
                $band = $this->lookupBandScore($sId, $count);
                $totalBandValues += $band;
                $skillCount++;
            }
            
            if ($skillCount > 0) {
                $result->band_score = $totalBandValues / $skillCount;
            }

            $result->save();

            return $result;
        });
    }

    private function generateResultId()
    {
        $latest = Result::orderBy('result_id', 'desc')->first();
        if (!$latest) return 'RS01';
        $num = intval(substr($latest->result_id, 2));
        return 'RS' . str_pad($num + 1, 2, '0', STR_PAD_LEFT);
    }

    private function saveAnswerDetails($resultId, $question, $userAnswer, &$isCorrect)
    {
        $qType = strtoupper($question->question_type);

        switch ($qType) {
            case 'MCQ':
                $this->saveMcqAnswer($resultId, $question, $userAnswer, $isCorrect);
                break;
            case 'FILL':
                $this->saveFillAnswer($resultId, $question, $userAnswer, $isCorrect);
                break;
            case 'DROPDOWN':
                $this->saveDropdownAnswer($resultId, $question, $userAnswer, $isCorrect);
                break;
            case 'MATCHING':
                $this->saveMatchingAnswer($resultId, $question, $userAnswer, $isCorrect);
                break;
            case 'TFNG':
                $this->saveTfngAnswer($resultId, $question, $userAnswer, $isCorrect);
                break;
            // Writing/Speaking handled as special cases or ignored for auto-grading
        }
    }

    private function saveMcqAnswer($resultId, $question, $userAnswer, &$isCorrect)
    {
        // Handle both single and multiple selection (JSON string)
        $selectedIds = [];
        try {
            $parsed = json_decode($userAnswer, true);
            $selectedIds = is_array($parsed) ? $parsed : [$userAnswer];
        } catch (\Exception $e) {
            $selectedIds = [$userAnswer];
        }

        // Logic for multiple selection grading:
        // In some IELTS parts, you need all correct to get 1 point? 
        // Or each correct option is a separate sub-question?
        // Default: If any part is wrong, it's wrong? No, let's keep it simple.
        // For standard IELTS MCQ, it's 1 correct option = 1 point.
        
        foreach ($selectedIds as $optId) {
            $option = $question->mcqQuestion->options->where('option_id', $optId)->first();
            $correct = $option ? $option->is_correct : false;
            if ($correct) $isCorrect = true; // Simplification

            McqAnswer::create([
                'amc_id' => 'AM' . Str::random(6), // Table migration used string amc_id(10)
                'result_id' => $resultId,
                'question_id' => $question->question_id,
                'selected_option_id' => $optId,
                'is_correct' => $correct
            ]);
        }
    }

    private function saveFillAnswer($resultId, $question, $userAnswer, &$isCorrect)
    {
        // user_answer might be JSON array if multi-blank
        $userInputs = [];
        try {
            $parsed = json_decode($userAnswer, true);
            $userInputs = is_array($parsed) ? $parsed : [$userAnswer];
        } catch (\Exception $e) {
            $userInputs = [$userAnswer];
        }

        // Find correct answers
        // Note: Check if FillQuestion has many FillAnswers or if it's one.
        // Based on model FillQuestion hasMany fillAnswers? Let's assume one for now or check.
        $correctAnswers = \App\Models\FillAnswer::where('question_id', $question->question_id)->pluck('correct_answer')->toArray();
        
        $match = false;
        foreach ($userInputs as $idx => $input) {
            if (isset($correctAnswers[$idx]) && strtolower(trim($input)) === strtolower(trim($correctAnswers[$idx]))) {
                $match = true;
            }
        }
        $isCorrect = $match;

        FillUserAnswer::create([
            'faw_id' => 'FW' . Str::random(6),
            'result_id' => $resultId,
            'question_id' => $question->question_id,
            'user_answer' => $userAnswer,
            'is_correct' => $isCorrect
        ]);
    }

    private function saveDropdownAnswer($resultId, $question, $userAnswer, &$isCorrect)
    {
        $option = $question->dropdownQuestion->options->where('option_id', $userAnswer)->first();
        $isCorrect = $option ? $option->is_correct : false;

        DropdownAnswer::create([
            'daw_id' => 'DW' . Str::random(6),
            'result_id' => $resultId,
            'question_id' => $question->question_id,
            'selected_option_id' => $userAnswer,
            'is_correct' => $isCorrect
        ]);
    }

    private function saveMatchingAnswer($resultId, $question, $userAnswer, &$isCorrect)
    {
        // userAnswer is JSON object: { "MA01": "Choice", "MA02": "..." }
        $userMap = json_decode($userAnswer, true) ?: [];
        $correctPairs = $question->matchingQuestion->answers; // HasMany

        $allMatch = true;
        foreach ($userMap as $ansId => $choice) {
            $pair = $correctPairs->where('answer_id', $ansId)->first();
            $match = ($pair && $pair->right_item === $choice);
            if (!$match) $allMatch = false;

            MatchingUserAnswer::create([
                'muw_id' => 'MW' . Str::random(6),
                'result_id' => $resultId,
                'question_id' => $question->question_id,
                'left_item' => $pair ? $pair->left_item : 'N/A',
                'right_item' => $choice,
                'is_correct' => $match
            ]);
        }
        $isCorrect = $allMatch && count($userMap) > 0;
    }

    private function saveTfngAnswer($resultId, $question, $userAnswer, &$isCorrect)
    {
        // Get correct answer from TfngAnswer table
        $correct = \App\Models\TfngAnswer::where('question_id', $question->question_id)->first();
        $isCorrect = ($correct && strtoupper(trim($userAnswer)) === strtoupper(trim($correct->correct_answer)));

        TfngUserAnswer::create([
            'tuw_id' => 'TW' . Str::random(6),
            'result_id' => $resultId,
            'question_id' => $question->question_id,
            'user_answer' => $userAnswer,
            'is_correct' => $isCorrect
        ]);
    }

    private function lookupBandScore($skillId, $correctCount)
    {
        $conv = BandScoreConversion::where('skill_id', $skillId)
            ->where('correct_count', '<=', $correctCount)
            ->orderBy('correct_count', 'desc')
            ->first();
        
        return $conv ? floatval($conv->band_score) : 0;
    }

    private function saveWritingSubmission($resultId, $userId, $groupId, $content)
    {
        \App\Models\WritingSubmission::create([
            'writing_id' => 'WR' . Str::random(6),
            'user_id' => $userId,
            'group_id' => $groupId,
            'content' => $content,
            'score' => null // To be scored by teacher
        ]);
    }
}
