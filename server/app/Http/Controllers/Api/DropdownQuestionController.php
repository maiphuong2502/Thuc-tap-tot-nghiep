<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DropdownQuestionServiceInterface;
use App\Http\Requests\StoreDropdownQuestionRequest;
use App\Http\Requests\UpdateDropdownQuestionRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\QueryException;

class DropdownQuestionController extends Controller
{
    public function __construct(
        protected DropdownQuestionServiceInterface $dropdownQuestionService
    ) {
    }

    public function index(): JsonResponse
    {
        $items = $this->dropdownQuestionService->getAll();

        return response()->json([
            'success' => true,
            'data' => $items,
        ]);
    }

    public function store(StoreDropdownQuestionRequest $request): JsonResponse
    {
        try {
            $row = $this->dropdownQuestionService->create($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Tạo câu hỏi chọn từ thành công.',
                'data' => $row,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function show(string $id): JsonResponse
    {
        $row = $this->dropdownQuestionService->find($id);
        if (!$row) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy câu hỏi.'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $row,
        ]);
    }

    public function update(UpdateDropdownQuestionRequest $request, string $id): JsonResponse
    {
        try {
            $row = $this->dropdownQuestionService->update($id, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật câu hỏi chọn từ thành công.',
                'data' => $row,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $this->dropdownQuestionService->delete($id);

            return response()->json([
                'success' => true,
                'message' => 'Đã xóa câu hỏi chọn từ thành công.',
            ]);
        } catch (QueryException $e) {
            if ($e->getCode() == '23000') {
                return response()->json([
                    'success' => false,
                    'message' => 'Câu hỏi đang được sử dụng',
                ], 400);
            }

            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi khi xóa.',
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
