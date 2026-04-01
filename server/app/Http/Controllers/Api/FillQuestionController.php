<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Services\FillQuestionServiceInterface;
use App\Http\Requests\StoreFillQuestionRequest;
use App\Http\Requests\UpdateFillQuestionRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\QueryException;

class FillQuestionController extends Controller
{
    protected $fillQuestionService;

    public function __construct(FillQuestionServiceInterface $fillQuestionService)
    {
        $this->fillQuestionService = $fillQuestionService;
    }

    public function index(): JsonResponse
    {
        $fillQuestions = $this->fillQuestionService->getAll();
        return response()->json([
            'success' => true,
            'data' => $fillQuestions
        ]);
    }

    public function store(StoreFillQuestionRequest $request): JsonResponse
    {
        try {
            $fillQuestion = $this->fillQuestionService->create($request->validated());
            return response()->json([
                'success' => true,
                'message' => 'Tạo câu hỏi điền từ thành công.',
                'data' => $fillQuestion
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function show(string $id): JsonResponse
    {
        $fillQuestion = $this->fillQuestionService->find($id);
        if (!$fillQuestion) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy câu hỏi.'], 404);
        }
        return response()->json([
            'success' => true,
            'data' => $fillQuestion
        ]);
    }

    public function update(UpdateFillQuestionRequest $request, string $id): JsonResponse
    {
        try {
            $fillQuestion = $this->fillQuestionService->update($id, $request->validated());
            return response()->json([
                'success' => true,
                'message' => 'Cập nhật câu hỏi điền từ thành công.',
                'data' => $fillQuestion
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $this->fillQuestionService->delete($id);
            return response()->json([
                'success' => true,
                'message' => 'Đã xóa câu hỏi điền từ thành công.'
            ]);
        } catch (QueryException $e) {
            // Check if constraint violation
            if ($e->getCode() == "23000") {
                return response()->json([
                    'success' => false,
                    'message' => 'Câu hỏi đang được sử dụng (trong bài test).'
                ], 400);
            }
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi khi xóa.'
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
