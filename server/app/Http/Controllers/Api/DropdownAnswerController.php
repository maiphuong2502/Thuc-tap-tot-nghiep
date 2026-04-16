<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DropdownAnswerServiceInterface;
use App\Http\Requests\StoreDropdownAnswerRequest;
use App\Http\Requests\UpdateDropdownAnswerRequest;
use Illuminate\Http\Request;
use Exception;

class DropdownAnswerController extends Controller
{
    protected $service;

    public function __construct(DropdownAnswerServiceInterface $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 15);
        $filters = $request->only(['result_id', 'question_id']);
        $data = $this->service->getAllPaginated($perPage, $filters);
        return response()->json(['data' => $data]);
    }

    public function store(StoreDropdownAnswerRequest $request)
    {
        $data = $this->service->create($request->validated());
        return response()->json(['message' => 'Lưu kết quả Dropdown thành công', 'data' => $data], 201);
    }

    public function show($id)
    {
        $data = $this->service->find($id);
        if (!$data) return response()->json(['message' => 'Không tìm thấy'], 404);
        return response()->json(['data' => $data]);
    }

    public function update(UpdateDropdownAnswerRequest $request, $id)
    {
        try {
            $data = $this->service->update($id, $request->validated());
            return response()->json(['message' => 'Cập nhật thành công', 'data' => $data]);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        try {
            $this->service->delete($id);
            return response()->json(['message' => 'Xóa thành công']);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
