<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\MatchingAnswerServiceInterface;
use App\Http\Requests\StoreMatchingAnswerRequest;
use App\Http\Requests\UpdateMatchingAnswerRequest;

class MatchingAnswerController extends Controller
{
    protected $matchingAnswerService;

    public function __construct(MatchingAnswerServiceInterface $matchingAnswerService)
    {
        $this->matchingAnswerService = $matchingAnswerService;
    }

    public function index(Request $request)
    {
        try {
            $answers = $this->matchingAnswerService->getAll();
            return response()->json([
                'status' => 'success',
                'data' => $answers
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function store(StoreMatchingAnswerRequest $request)
    {
        try {
            $data = $request->validated();
            $answer = $this->matchingAnswerService->create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Lưu đáp án nối thành công',
                'data' => $answer
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 400);
        }
    }

    public function show(string $id)
    {
        try {
            $answer = $this->matchingAnswerService->find($id);

            if (!$answer) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy đáp án nối'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $answer
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function update(UpdateMatchingAnswerRequest $request, string $id)
    {
        try {
            $data = $request->validated();
            $answer = $this->matchingAnswerService->update($id, $data);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật đáp án nối thành công',
                'data' => $answer
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 400);
        }
    }

    public function destroy(string $id)
    {
        try {
            $this->matchingAnswerService->delete($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Xóa đáp án nối thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Xóa thất bại: ' . $e->getMessage()
            ], 400);
        }
    }
}
