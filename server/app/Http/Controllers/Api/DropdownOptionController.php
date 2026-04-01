<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\DropdownOptionServiceInterface;
use App\Http\Requests\StoreDropdownOptionRequest;
use App\Http\Requests\UpdateDropdownOptionRequest;

class DropdownOptionController extends Controller
{
    protected $dropdownOptionService;

    public function __construct(DropdownOptionServiceInterface $dropdownOptionService)
    {
        $this->dropdownOptionService = $dropdownOptionService;
    }

    public function index(Request $request)
    {
        try {
            $options = $this->dropdownOptionService->getAll();
            return response()->json([
                'status' => 'success',
                'data' => $options
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function store(StoreDropdownOptionRequest $request)
    {
        try {
            $data = $request->validated();
            $option = $this->dropdownOptionService->create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Lưu đáp án chọn từ thành công',
                'data' => $option
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
            $option = $this->dropdownOptionService->find($id);

            if (!$option) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy đáp án chọn từ'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $option
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function update(UpdateDropdownOptionRequest $request, string $id)
    {
        try {
            $data = $request->validated();
            $option = $this->dropdownOptionService->update($id, $data);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật đáp án chọn từ thành công',
                'data' => $option
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
            $this->dropdownOptionService->delete($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Xóa đáp án chọn từ thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Xóa thất bại: ' . $e->getMessage()
            ], 400);
        }
    }
}
