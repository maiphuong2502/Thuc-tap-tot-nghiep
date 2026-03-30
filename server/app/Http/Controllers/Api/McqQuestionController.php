<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Services\McqQuestionServiceInterface;
use App\Http\Requests\StoreMcqQuestionRequest;
use App\Http\Requests\UpdateMcqQuestionRequest;
use Illuminate\Http\JsonResponse;

class McqQuestionController extends Controller
{
    protected $mcqQuestionService;

    public function __construct(McqQuestionServiceInterface $mcqQuestionService)
    {
        $this->mcqQuestionService = $mcqQuestionService;
    }

    public function index(): JsonResponse
    {
        $mcqQuestions = $this->mcqQuestionService->getAll();
        return response()->json([
            'success' => true,
            'data' => $mcqQuestions
        ]);
    }

    public function store(StoreMcqQuestionRequest $request): JsonResponse
    {
        $mcqQuestion = $this->mcqQuestionService->create($request->validated());
        return response()->json([
            'success' => true,
            'message' => 'MCQ Question created successfully.',
            'data' => $mcqQuestion
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $mcqQuestion = $this->mcqQuestionService->find($id);
        if (!$mcqQuestion) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
        return response()->json([
            'success' => true,
            'data' => $mcqQuestion
        ]);
    }

    public function update(UpdateMcqQuestionRequest $request, string $id): JsonResponse
    {
        $mcqQuestion = $this->mcqQuestionService->update($id, $request->validated());
        return response()->json([
            'success' => true,
            'message' => 'MCQ Question updated successfully.',
            'data' => $mcqQuestion
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $this->mcqQuestionService->delete($id);
            return response()->json([
                'success' => true,
                'message' => 'MCQ Question deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Câu hỏi MCQ đã có đáp án, không thể xóa'
            ], 400);
        }
    }
}
