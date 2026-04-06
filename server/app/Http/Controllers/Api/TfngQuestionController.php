<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\TfngQuestionServiceInterface;
use App\Http\Requests\StoreTfngQuestionRequest;
use App\Http\Requests\UpdateTfngQuestionRequest;

class TfngQuestionController extends Controller
{
    protected $tfngQuestionService;

    public function __construct(TfngQuestionServiceInterface $tfngQuestionService)
    {
        $this->tfngQuestionService = $tfngQuestionService;
    }

    public function index(Request $request)
    {
        try {
            $questions = $this->tfngQuestionService->getAll();
            return response()->json([
                'status' => 'success',
                'data'   => $questions
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function store(StoreTfngQuestionRequest $request)
    {
        try {
            $data     = $request->validated();
            $question = $this->tfngQuestionService->create($data);

            return response()->json([
                'status'  => 'success',
                'message' => 'Lưu câu hỏi TFNG thành công',
                'data'    => $question
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 400);
        }
    }

    public function show(string $id)
    {
        try {
            $question = $this->tfngQuestionService->find($id);

            if (!$question) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Không tìm thấy câu hỏi TFNG'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data'   => $question
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function update(UpdateTfngQuestionRequest $request, string $id)
    {
        try {
            $data     = $request->validated();
            $question = $this->tfngQuestionService->update($id, $data);

            return response()->json([
                'status'  => 'success',
                'message' => 'Cập nhật câu hỏi TFNG thành công',
                'data'    => $question
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 400);
        }
    }

    public function destroy(string $id)
    {
        try {
            $this->tfngQuestionService->delete($id);

            return response()->json([
                'status'  => 'success',
                'message' => 'Xóa câu hỏi TFNG thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Xóa thất bại: ' . $e->getMessage()
            ], 400);
        }
    }
}
