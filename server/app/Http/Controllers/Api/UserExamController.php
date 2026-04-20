<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Test;
use App\Services\ExamSubmissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserExamController extends Controller
{
    protected $submissionService;

    public function __construct(ExamSubmissionService $submissionService)
    {
        $this->submissionService = $submissionService;
    }

    /**
     * Get list of tests for users
     */
    public function index(Request $request)
    {
        try {
            $tests = Test::orderBy('test_id', 'desc')->paginate(15);
            return response()->json([
                'success' => true,
                'data' => $tests
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching user exams: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách bộ đề.'
            ], 500);
        }
    }

    /**
     * Get a fully structured test for exam taking
     */
    public function getFullStructure($id)
    {
        try {
            // Eager load everything needed for the test structure
            $test = Test::with([
                'parts',
                'parts.skill',
                'parts.questionGroups',
                'parts.questionGroups.passage',
                'parts.questionGroups.audio',
                'parts.questionGroups.questions',
                'parts.questionGroups.questions.mcqQuestion.options',
                'parts.questionGroups.questions.fillQuestion',
                'parts.questionGroups.questions.dropdownQuestion.options',
                'parts.questionGroups.questions.matchingQuestion.answers',
                'parts.questionGroups.questions.tfngQuestion',
            ])->where('test_id', $id)->first();

            if (!$test) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy bộ đề.'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $test
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching full test structure: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy dữ liệu cấu trúc bộ đề.'
            ], 500);
        }
    }

    /**
     * Submit exam answers
     */
    public function submit(Request $request, $id)
    {
        try {
            $answers = $request->input('answers', []);
            $userId = $request->user() ? $request->user()->id : 'USR01'; // Fallback if no auth

            $result = $this->submissionService->submit($id, $userId, $answers);

            return response()->json([
                'success' => true,
                'message' => 'Nộp bài thành công!',
                'data' => $result
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error submitting exam: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi nộp bài: ' . $e->getMessage()
            ], 500);
        }
    }
}
