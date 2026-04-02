<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\MatchingQuestionServiceInterface;
use App\Http\Requests\StoreMatchingQuestionRequest;
use App\Http\Requests\UpdateMatchingQuestionRequest;

class MatchingQuestionController extends Controller
{
    protected $matchingQuestionService;

    public function __construct(MatchingQuestionServiceInterface $matchingQuestionService)
    {
        $this->matchingQuestionService = $matchingQuestionService;
    }

    public function index(Request $request)
    {
        try {
            $questions = $this->matchingQuestionService->getAll();
            return response()->json([
                'status' => 'success',
                'data' => $questions
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function store(StoreMatchingQuestionRequest $request)
    {
        try {
            $data = $request->validated();
            $question = $this->matchingQuestionService->create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Lưu câu hỏi nối thành công',
                'data' => $question
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 400);
        }
    }

    public function show(string $id)
    {
        try {
            $question = $this->matchingQuestionService->find($id);

            if (!$question) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy câu hỏi nối'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $question
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function update(UpdateMatchingQuestionRequest $request, string $id)
    {
        try {
            $data = $request->validated();
            $question = $this->matchingQuestionService->update($id, $data);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật câu hỏi nối thành công',
                'data' => $question
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 400);
        }
    }

    public function destroy(string $id)
    {
        try {
            $this->matchingQuestionService->delete($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Xóa câu hỏi nối thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Xóa thất bại: ' . $e->getMessage()
            ], 400);
        }
    }
}
