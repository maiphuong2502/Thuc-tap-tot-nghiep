<?php

namespace App\Http\Controllers;

use App\Services\QuestionGroupServiceInterface;
use Illuminate\Http\Request;

class QuestionGroupController extends Controller
{
    protected $questionGroupService;

    public function __construct(QuestionGroupServiceInterface $questionGroupService)
    {
        $this->questionGroupService = $questionGroupService;
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 10);
        $data = $this->questionGroupService->getQuestionGroups($request->all(), $perPage);
        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'skill_id' => 'required|string|max:10|exists:skills,id',
            'title' => 'required|string|max:255',
            'passage_id' => 'nullable|string|max:5|exists:passages,passage_id',
            'audio_id' => 'nullable|string|max:10|exists:audios,audio_id',
            'type' => 'required|string|max:50',
        ]);

        $item = $this->questionGroupService->create($validated);
        return response()->json([
            'success' => true,
            'message' => 'Nhóm câu hỏi tạo thành công',
            'data' => $item
        ], 201);
    }

    public function show($id)
    {
        $item = $this->questionGroupService->find($id);
        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Question Group not found'
            ], 404);
        }
        return response()->json([
            'success' => true,
            'data' => $item
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'skill_id' => 'sometimes|string|max:10|exists:skills,id',
            'title' => 'sometimes|string|max:255',
            'passage_id' => 'nullable|string|max:5|exists:passages,passage_id',
            'audio_id' => 'nullable|string|max:10|exists:audios,audio_id',
            'type' => 'sometimes|string|max:50',
        ]);

        $item = $this->questionGroupService->update($id, $validated);
        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Question Group not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật nhóm câu hỏi thành công',
            'data' => $item
        ]);
    }

    public function destroy($id)
    {
        $deleted = $this->questionGroupService->delete($id);
        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Question Group not found or could not be deleted'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Xóa nhóm câu hỏi thành công'
        ]);
    }
}
