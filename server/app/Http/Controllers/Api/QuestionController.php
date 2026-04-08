<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\QuestionServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class QuestionController extends Controller
{
    protected $questionService;

    public function __construct(QuestionServiceInterface $questionService)
    {
        $this->questionService = $questionService;
    }

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 10);
        $filters = [
            'skill' => $request->input('skill'),
            'type' => $request->input('type'),
            'group' => $request->input('group'),
        ];

        $questions = $this->questionService->getQuestionsList($perPage, $filters);

        return response()->json([
            'success' => true,
            'data' => $questions
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'group_id' => 'required|string',
            'question_type' => 'required|string|in:DROPDOWN,dropdown,matching,FILL,fill,MCQ,mcq,tfng,MAP,map',
            'order_index' => 'required|integer|min:1',
            'question_id' => 'nullable|string|unique:questions,question_id'
        ]);

        $question = $this->questionService->createQuestion($data);

        return response()->json([
            'success' => true,
            'message' => 'Question created successfully',
            'data' => $question
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $question = $this->questionService->getQuestionById($id);

        return response()->json([
            'success' => true,
            'data' => $question
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $data = $request->validate([
            'group_id' => 'sometimes|required|string',
            'question_type' => 'sometimes|required|string|in:DROPDOWN,dropdown,matching,FILL,fill,MCQ,mcq,tfng,MAP,map',
            'order_index' => 'sometimes|required|integer|min:1',
        ]);

        $question = $this->questionService->updateQuestion($id, $data);

        return response()->json([
            'success' => true,
            'message' => 'Question updated successfully',
            'data' => $question
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->questionService->deleteQuestion($id);

        return response()->json([
            'success' => true,
            'message' => 'Question deleted successfully'
        ]);
    }
}
