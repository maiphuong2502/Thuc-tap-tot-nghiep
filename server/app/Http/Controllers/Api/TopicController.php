<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TopicServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TopicController extends Controller
{
    protected $topicService;

    public function __construct(TopicServiceInterface $topicService)
    {
        $this->topicService = $topicService;
    }

    /**
     * Lấy danh sách chủ đề.
     */
    public function index(): JsonResponse
    {
        $topics = $this->topicService->getTopicsList();

        return response()->json([
            'success' => true,
            'data' => $topics,
        ]);
    }

    /**
     * Thêm chủ đề mới.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'topic_name' => 'required|string|max:100|unique:topics,topic_name',
            'description' => 'nullable|string',
        ]);

        $topic = $this->topicService->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Thêm chủ đề thành công',
            'data' => $topic,
        ]);
    }

    /**
     * Cập nhật chủ đề.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'topic_name' => 'required|string|max:100|unique:topics,topic_name,' . $id . ',topic_id',
            'description' => 'nullable|string',
        ]);

        $topic = $this->topicService->update($id, $validated);

        if (!$topic) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy chủ đề',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật chủ đề thành công',
            'data' => $topic,
        ]);
    }

    /**
     * Xóa chủ đề.
     */
    public function destroy($id): JsonResponse
    {
        // TODO: Kiểm tra xem chủ đề có đang được sử dụng hay không
        
        $deleted = $this->topicService->delete($id);

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy chủ đề hoặc không thể xóa',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Xóa chủ đề thành công',
        ]);
    }
}
