<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Services\FillAnswerServiceInterface;
use App\Http\Requests\StoreFillAnswerRequest;
use App\Http\Requests\UpdateFillAnswerRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\QueryException;

class FillAnswerController extends Controller
{
    protected $fillAnswerService;

    public function __construct(FillAnswerServiceInterface $fillAnswerService)
    {
        $this->fillAnswerService = $fillAnswerService;
    }

    public function index(): JsonResponse
    {
        $fillAnswers = $this->fillAnswerService->getAll();
        return response()->json([
            'success' => true,
            'data' => $fillAnswers
        ]);
    }

    public function store(StoreFillAnswerRequest $request): JsonResponse
    {
        try {
            $fillAnswer = $this->fillAnswerService->create($request->validated());
            return response()->json([
                'success' => true,
                'message' => 'Tạo đáp án thành công.',
                'data' => $fillAnswer
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
        $fillAnswer = $this->fillAnswerService->find($id);
        if (!$fillAnswer) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy đáp án.'], 404);
        }
        return response()->json([
            'success' => true,
            'data' => $fillAnswer
        ]);
    }

    public function update(UpdateFillAnswerRequest $request, string $id): JsonResponse
    {
        try {
            $fillAnswer = $this->fillAnswerService->update($id, $request->validated());
            return response()->json([
                'success' => true,
                'message' => 'Cập nhật đáp án thành công.',
                'data' => $fillAnswer
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
            $this->fillAnswerService->delete($id);
            return response()->json([
                'success' => true,
                'message' => 'Đã xóa đáp án thành công.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
