<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\TestServiceInterface;
use Illuminate\Support\Facades\Log;

class TestController extends Controller
{
    protected $testService;

    public function __construct(TestServiceInterface $testService)
    {
        $this->testService = $testService;
    }

    public function index(Request $request)
    {
        try {
            $keyword = $request->query('keyword');
            $tests = $this->testService->getAllTests($keyword);
            return response()->json([
                'success' => true,
                'data' => $tests
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching tests: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách bộ đề.'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'test_name' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $test = $this->testService->createTest($data);

            return response()->json([
                'success' => true,
                'message' => 'Thêm bộ đề thành công.',
                'data' => $test
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi dữ liệu đầu vào.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating test: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo bộ đề mới.'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'test_name' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $test = $this->testService->updateTest($id, $data);

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật bộ đề thành công.',
                'data' => $test
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi dữ liệu đầu vào.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating test: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật bộ đề.'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->testService->deleteTest($id);
            return response()->json([
                'success' => true,
                'message' => 'Xóa bộ đề thành công.'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting test: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa bộ đề.'
            ], 500);
        }
    }
}