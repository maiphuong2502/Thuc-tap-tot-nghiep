<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ExamTypeServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExamTypeController extends Controller
{
    protected $examTypeService;

    public function __construct(ExamTypeServiceInterface $examTypeService)
    {
        $this->examTypeService = $examTypeService;
    }

    public function index(): JsonResponse
    {
        $examTypes = $this->examTypeService->getExamTypesList();
        
        return response()->json([
            'success' => true,
            'data' => $examTypes,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_name' => ['required', 'string', 'max:100'],
            'description'   => ['nullable', 'string', 'max:255'],
        ]);

        $examType = $this->examTypeService->createExamType($validated);

        return response()->json([
            'success' => true,
            'message' => 'Thêm loại đề thi thành công.',
            'data' => $examType,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'category_name' => ['sometimes', 'required', 'string', 'max:100'],
            'description'   => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $examType = $this->examTypeService->updateExamType($id, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật loại đề thi thành công.',
            'data' => $examType,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->examTypeService->deleteExamType($id);

        return response()->json([
            'success' => true,
            'message' => 'Xóa loại đề thi thành công.',
        ]);
    }
}
