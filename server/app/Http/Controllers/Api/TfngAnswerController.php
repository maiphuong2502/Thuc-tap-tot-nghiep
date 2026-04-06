<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\TfngAnswerServiceInterface;
use App\Http\Requests\StoreTfngAnswerRequest;
use App\Http\Requests\UpdateTfngAnswerRequest;

class TfngAnswerController extends Controller
{
    protected $tfngAnswerService;

    public function __construct(TfngAnswerServiceInterface $tfngAnswerService)
    {
        $this->tfngAnswerService = $tfngAnswerService;
    }

    public function index(Request $request)
    {
        try {
            $answers = $this->tfngAnswerService->getAll();
            return response()->json([
                'status' => 'success',
                'data'   => $answers,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function store(StoreTfngAnswerRequest $request)
    {
        try {
            $data   = $request->validated();
            $answer = $this->tfngAnswerService->create($data);

            return response()->json([
                'status'  => 'success',
                'message' => 'Lưu đáp án TFNG thành công',
                'data'    => $answer,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Lỗi: ' . $e->getMessage(),
            ], 400);
        }
    }

    public function show(string $id)
    {
        try {
            $answer = $this->tfngAnswerService->find($id);

            if (!$answer) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Không tìm thấy đáp án TFNG',
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data'   => $answer,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function update(UpdateTfngAnswerRequest $request, string $id)
    {
        try {
            $data   = $request->validated();
            $answer = $this->tfngAnswerService->update($id, $data);

            return response()->json([
                'status'  => 'success',
                'message' => 'Cập nhật đáp án TFNG thành công',
                'data'    => $answer,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Lỗi: ' . $e->getMessage(),
            ], 400);
        }
    }

    public function destroy(string $id)
    {
        try {
            $this->tfngAnswerService->delete($id);

            return response()->json([
                'status'  => 'success',
                'message' => 'Xóa đáp án TFNG thành công',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Xóa thất bại: ' . $e->getMessage(),
            ], 400);
        }
    }
}
