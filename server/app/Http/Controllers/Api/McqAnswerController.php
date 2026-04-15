<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\McqAnswerServiceInterface;
use App\Http\Requests\StoreMcqAnswerRequest;
use App\Http\Requests\UpdateMcqAnswerRequest;
use Illuminate\Http\Request;
use Exception;

class McqAnswerController extends Controller
{
    protected $mcqAnswerService;

    public function __construct(McqAnswerServiceInterface $mcqAnswerService)
    {
        $this->mcqAnswerService = $mcqAnswerService;
    }

    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 15);
        $filters = $request->only(['result_id', 'question_id']);

        $data = $this->mcqAnswerService->getAllPaginated($perPage, $filters);
        return response()->json(['data' => $data]);
    }

    public function store(StoreMcqAnswerRequest $request)
    {
        $data = $this->mcqAnswerService->create($request->validated());
        return response()->json([
            'message' => 'Lưu kết quả MCQ thành công',
            'data' => $data
        ], 201);
    }

    public function show($id)
    {
        $data = $this->mcqAnswerService->find($id);

        if (!$data) {
            return response()->json(['message' => 'Không tìm thấy kết quả MCQ'], 404);
        }

        return response()->json(['data' => $data]);
    }

    public function update(UpdateMcqAnswerRequest $request, $id)
    {
        try {
            $data = $this->mcqAnswerService->update($id, $request->validated());
            return response()->json([
                'message' => 'Cập nhật kết quả MCQ thành công',
                'data' => $data
            ]);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        try {
            $this->mcqAnswerService->delete($id);
            return response()->json(['message' => 'Xóa kết quả MCQ thành công']);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
