<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ResultServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ResultController extends Controller
{
    protected $resultService;

    public function __construct(ResultServiceInterface $resultService)
    {
        $this->resultService = $resultService;
    }

    /**
     * Lấy danh sách kết quả (cho Admin)
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 15);
        $filters = $request->only(['user_id', 'test_id']);
        $results = $this->resultService->getAllPaginated($perPage, $filters);
        return response()->json(['data' => $results]);
    }

    /**
     * Nộp bài thi và tính điểm
     */
    public function submitTest(Request $request)
    {
        try {
            $validated = $request->validate([
                'test_id' => 'required|string|exists:tests,test_id',
                'answers' => 'present', 
                'start_time' => 'nullable',
            ]);

            $user = $request->user();
            $validated['user_id'] = $user->id || $user->user_id; // Thử cả 2 trường hợp để chắc chắn

            $result = $this->resultService->storeResult($validated);

            return response()->json([
                'message' => 'Nộp bài thành công!',
                'data' => $result
            ], 201);
        } catch (\Exception $e) {
            Log::error('Lỗi khi nộp bài: ' . $e->getMessage());
            return response()->json([
                'message' => 'Có lỗi xảy ra khi xử lý kết quả: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy chi tiết kết quả
     */
    public function show($id)
    {
        $result = $this->resultService->getResultById($id);

        if (!$result) {
            return response()->json(['message' => 'Không tìm thấy kết quả'], 404);
        }

        return response()->json(['data' => $result]);
    }

    /**
     * Lấy dữ liệu chi tiết để xem lại bài làm
     */
    public function review($id)
    {
        $result = $this->resultService->getReviewData($id);

        if (!$result) {
            return response()->json(['message' => 'Không tìm thấy kết quả review'], 404);
        }

        return response()->json(['data' => $result]);
    }

    /**
     * Lấy danh sách kết quả của người dùng hiện tại
     */
    public function userResults(Request $request)
    {
        $results = $this->resultService->getUserResults($request->user()->user_id);
        return response()->json(['data' => $results]);
    }
}
