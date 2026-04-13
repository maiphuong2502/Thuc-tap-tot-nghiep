<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SpeakingSubmissionServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SpeakingSubmissionController extends Controller
{
    protected $service;

    public function __construct(SpeakingSubmissionServiceInterface $service)
    {
        $this->service = $service;
    }

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 10);
        $filters = [
            'user_id'     => $request->input('user_id'),
            'question_id' => $request->input('question_id'),
            'has_score'   => $request->input('has_score'),
        ];

        $submissions = $this->service->getList($perPage, $filters);

        return response()->json([
            'success' => true,
            'data'    => $submissions,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'speaking_id' => 'nullable|string|unique:speaking_submissions,speaking_id',
            'user_id'     => 'required|string',
            'question_id' => 'required|string',
            'audio_url'   => 'required|string',
            'score'       => 'nullable|numeric|min:0|max:10',
        ]);

        $submission = $this->service->create($data);

        return response()->json([
            'success' => true,
            'message' => 'Bài nói đã được tạo thành công.',
            'data'    => $submission,
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $submission = $this->service->getById($id);

        return response()->json([
            'success' => true,
            'data'    => $submission,
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $data = $request->validate([
            'user_id'     => 'sometimes|required|string',
            'question_id' => 'sometimes|required|string',
            'audio_url'   => 'sometimes|required|string',
            'score'       => 'nullable|numeric|min:0|max:10',
        ]);

        $submission = $this->service->update($id, $data);

        return response()->json([
            'success' => true,
            'message' => 'Bài nói đã được cập nhật thành công.',
            'data'    => $submission,
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->service->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'Bài nói đã được xóa thành công.',
        ]);
    }
}
