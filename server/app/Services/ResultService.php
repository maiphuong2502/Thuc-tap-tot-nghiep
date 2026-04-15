<?php

namespace App\Services;

use App\Repositories\ResultRepositoryInterface;
use App\Models\Question;
use App\Models\BandScoreConversion;
use App\Models\Test;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ResultService implements ResultServiceInterface
{
    protected $resultRepo;

    public function __construct(ResultRepositoryInterface $resultRepo)
    {
        $this->resultRepo = $resultRepo;
    }

    public function storeResult(array $data)
    {
        return DB::transaction(function () use ($data) {
            $userId = $data['user_id'];
            $testId = $data['test_id'];
            $userAnswers = $data['answers']; 
            $startTime = Carbon::parse($data['start_time']);
            $endTime = Carbon::now();

            // 1. Tạo ID Result mới (RSxx) và tạo bản ghi Result trước để các bảng con có thể tham chiếu
            $resultId = $this->generateResultId();
            $result = $this->resultRepo->create([
                'result_id' => $resultId,
                'user_id' => $userId,
                'test_id' => $testId,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'total_questions' => 0,
                'correct_count' => 0,
                'wrong_count' => 0,
                'skipped_count' => 0,
                'band_score' => 0.0,
            ]);

            // 2. Lấy tất cả câu hỏi của bài test này để chấm điểm chính xác
            $questions = Question::whereHas('group.part', function($query) use ($testId) {
                $query->where('test_id', $testId);
            })->with([
                'mcqQuestion.options',
                'fillQuestion',
                'dropdownQuestion.options',
                'matchingQuestion.answers',
                'tfngQuestion'
            ])->get();

            $correctOverall = 0;
            $totalQuestions = 0;
            $wrongCount = 0;
            $skippedCount = 0;
            $skillStats = []; 

            foreach ($questions as $question) {
                $qId = $question->question_id;
                $userAns = $userAnswers[$qId] ?? null;
                $skillId = $question->skill_id;

                if (!isset($skillStats[$skillId])) {
                    $skillStats[$skillId] = ['correct' => 0, 'total' => 0];
                }

                if ($userAns === null || $userAns === '' || $userAns === '[]' || $userAns === '{}') {
                    // Vẫn phải tính tổng điểm tối đa của câu này dù bỏ trống
                    $points = $this->saveAndCheckAnswer($resultId, $question, null);
                    $totalQuestions += $points['total'];
                    $skillStats[$skillId]['total'] += $points['total'];
                    $skippedCount++; // Ghi nhận là câu hỏi đã bị bỏ qua (tính theo đơn vị Question ID)
                    continue;
                }

                $points = $this->saveAndCheckAnswer($resultId, $question, $userAns);
                
                $correctOverall += $points['correct'];
                $totalQuestions += $points['total'];
                $skillStats[$skillId]['correct'] += $points['correct'];
                $skillStats[$skillId]['total'] += $points['total'];

                if ($points['correct'] < $points['total']) {
                    $wrongCount++;
                }
            }

            // 3. Tính toán Band Score cho từng kỹ năng và Overall
            $skillBands = [
                'SK01' => 0.0, 'SK02' => 0.0, 'SK03' => 0.0, 'SK04' => 0.0,
            ];

            foreach ($skillStats as $skillId => $stats) {
                $scaledCorrect = ($stats['total'] > 0) ? ($stats['correct'] / $stats['total']) * 40 : 0;
                $skillBands[$skillId] = $this->calculateBandScore($skillId, $scaledCorrect);
            }

            $activeBands = array_filter($skillBands, function($band) { return $band > 0; });
            $average = count($activeBands) > 0 ? array_sum($activeBands) / count($activeBands) : 0;
            $overallBand = $this->roundIeltsScore($average);

            // 4. Cập nhật lại bản ghi Result với kết quả cuối cùng
            $result->update([
                'total_questions' => $totalQuestions,
                'correct_count' => $correctOverall,
                'wrong_count' => $wrongCount,
                'skipped_count' => $skippedCount,
                'band_score' => $overallBand,
                'listening_band' => $skillBands['SK01'],
                'reading_band' => $skillBands['SK02'],
                'writing_band' => $skillBands['SK03'],
                'speaking_band' => $skillBands['SK04'],
            ]);

            return $result;
        });
    }

    /**
     * Quy tắc làm tròn IELTS: 
     * - Dưới .25 -> về .0
     * - Từ .25 đến dưới .75 -> về .5
     * - Từ .75 trở lên -> lên .0 tiếp theo
     */
    private function roundIeltsScore($score)
    {
        $whole = floor($score);
        $fraction = $score - $whole;

        if ($fraction < 0.25) {
            return $whole;
        } elseif ($fraction < 0.75) {
            return $whole + 0.5;
        } else {
            return $whole + 1.0;
        }
    }

    private function generateResultId()
    {
        $latest = \App\Models\Result::orderBy('result_id', 'desc')->first();
        if (!$latest) return 'RS01';
        $num = intval(substr($latest->result_id, 2));
        return 'RS' . str_pad($num + 1, 2, '0', STR_PAD_LEFT);
    }

    protected function saveAndCheckAnswer($resultId, $question, $userAns)
    {
        $qType = strtolower($question->question_type);
        $qId = $question->question_id;
        $points = ['correct' => 0, 'total' => 0];

        // Nếu bỏ trống, vẫn cần xác định total points để tính tỷ lệ chính xác
        if ($userAns === null) {
            switch ($qType) {
                case 'fill': $points['total'] = \App\Models\FillAnswer::where('question_id', $qId)->count(); break;
                case 'matching': $points['total'] = $question->matchingQuestion->answers->count(); break;
                default: $points['total'] = 1; break;
            }
            return $points;
        }

        switch ($qType) {
            case 'mcq':
                $selectedIds = json_decode($userAns, true);
                if (!is_array($selectedIds)) $selectedIds = [$userAns];
                
                $correctOptions = $question->mcqQuestion->options->where('is_correct', 1)->pluck('option_id')->toArray();
                $isCorrect = !empty($selectedIds) && count(array_diff($selectedIds, $correctOptions)) === 0 && count($selectedIds) === count($correctOptions);
                
                $points['total'] = 1; 
                if ($isCorrect) $points['correct'] = 1;

                foreach ($selectedIds as $optId) {
                    \App\Models\McqAnswer::create([
                        'amc_id' => 'AM' . \Illuminate\Support\Str::random(6),
                        'result_id' => $resultId,
                        'question_id' => $qId,
                        'selected_option_id' => $optId,
                        'is_correct' => in_array($optId, $correctOptions)
                    ]);
                }
                break;

            case 'fill':
                $userAnswersArray = json_decode($userAns, true);
                if (!is_array($userAnswersArray)) $userAnswersArray = [$userAns];
                
                $correctAnswers = \App\Models\FillAnswer::where('question_id', $qId)->orderBy('answer_id', 'asc')->get();
                $points['total'] = $correctAnswers->count();
                
                foreach ($correctAnswers as $index => $correctObj) {
                    $singleAns = $userAnswersArray[$index] ?? null;
                    $isBlankCorrect = false;
                    
                    if ($singleAns !== null && $singleAns !== '') {
                        $possibleAnswers = explode('/', strtolower(trim($correctObj->correct_answer)));
                        if (in_array(strtolower(trim($singleAns)), $possibleAnswers)) {
                            $isBlankCorrect = true;
                            $points['correct']++;
                        }
                    }

                    \App\Models\FillUserAnswer::create([
                        'faw_id' => 'FW' . \Illuminate\Support\Str::random(6),
                        'result_id' => $resultId,
                        'question_id' => $qId,
                        'user_answer' => is_array($singleAns) ? json_encode($singleAns) : ($singleAns ?? ''),
                        'is_correct' => $isBlankCorrect
                    ]);
                }
                break;

            case 'dropdown':
                $option = $question->dropdownQuestion->options->where('option_id', $userAns)->first();
                $isCorrect = $option && $option->is_correct;
                
                $points['total'] = 1;
                if ($isCorrect) $points['correct'] = 1;

                \App\Models\DropdownAnswer::create([
                    'daw_id' => 'DW' . \Illuminate\Support\Str::random(6),
                    'result_id' => $resultId,
                    'question_id' => $qId,
                    'selected_option_id' => $userAns,
                    'is_correct' => $isCorrect
                ]);
                break;

            case 'matching':
                $userMap = json_decode($userAns, true) ?: [];
                $correctPairs = $question->matchingQuestion->answers;
                $points['total'] = $correctPairs->count();
                
                foreach ($correctPairs as $pair) {
                    $choice = $userMap[$pair->answer_id] ?? null;
                    $match = ($choice && $pair->right_item === $choice);
                    if ($match) $points['correct']++;

                    \App\Models\MatchingUserAnswer::create([
                        'muw_id' => 'MW' . \Illuminate\Support\Str::random(6),
                        'result_id' => $resultId,
                        'question_id' => $qId,
                        'left_item' => $pair->left_item,
                        'right_item' => $choice ?? 'N/A',
                        'is_correct' => $match
                    ]);
                }
                break;

            case 'tfng':
                $correct = \App\Models\TfngAnswer::where('question_id', $qId)->first();
                $isCorrect = $correct && strtoupper(trim($userAns)) === strtoupper(trim($correct->correct_answer));
                
                $points['total'] = 1;
                if ($isCorrect) $points['correct'] = 1;

                \App\Models\TfngUserAnswer::create([
                    'tuw_id' => 'TW' . \Illuminate\Support\Str::random(6),
                    'result_id' => $resultId,
                    'question_id' => $qId,
                    'user_answer' => $userAns,
                    'is_correct' => $isCorrect
                ]);
                break;
        }

        return $points;
    }

    protected function calculateBandScore($skillId, $correctCount)
    {
        $moduleType = ($skillId === 'SK01') ? 'Listening' : 'Reading Academic';

        $conversion = BandScoreConversion::where('skill_id', $skillId)
            ->where('correct_count', '<=', $correctCount)
            ->orderBy('correct_count', 'desc')
            ->first();

        return $conversion ? $conversion->band_score : 0.0;
    }

    public function getAllPaginated(int $perPage, array $filters = [])
    {
        return $this->resultRepo->getPaginated($perPage, $filters);
    }

    public function getResultById(string $id)
    {
        return $this->resultRepo->find($id) ? $this->resultRepo->find($id)->load(['user', 'test']) : null;
    }

    public function getReviewData(string $id)
    {
        $result = $this->resultRepo->find($id);
        if (!$result) return null;

        return $result->load([
            'user', 
            'test.parts.questionGroups.passage',
            'test.parts.questionGroups.audio',
            'test.parts.questionGroups.questions.mcqQuestion.options',
            'test.parts.questionGroups.questions.fillQuestion.answers',
            'test.parts.questionGroups.questions.dropdownQuestion.options',
            'test.parts.questionGroups.questions.matchingQuestion.answers',
            'test.parts.questionGroups.questions.tfngQuestion.answers',
            'test.parts.questionGroups.questions.skill',
            'mcqAnswers',
            'fillUserAnswers',
            'dropdownAnswers',
            'matchingUserAnswers',
            'tfngUserAnswers'
        ]);
    }

    public function getUserResults(string $userId)
    {
        return $this->resultRepo->getByUserId($userId);
    }
}
