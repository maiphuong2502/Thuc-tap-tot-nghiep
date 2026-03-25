<?php

namespace App\Http\Controllers;

use App\Models\TestPart;
use Illuminate\Http\Request;
use App\Services\TestPartServiceInterface;
use App\Http\Requests\StoreTestPartRequest;
use App\Http\Requests\UpdateTestPartRequest;
use Illuminate\Http\JsonResponse;

class TestPartController extends Controller
{
    protected $testPartService;

    public function __construct(TestPartServiceInterface $testPartService)
    {
        $this->testPartService = $testPartService;
    }

    public function index(Request $request): JsonResponse
    {
        $result = $this->testPartService->getTestParts($request->all(), (int) $request->input('per_page', 10));
        return response()->json($result);
    }

    public function store(StoreTestPartRequest $request): JsonResponse
    {
        $testPart = $this->testPartService->create($request->validated());
        return response()->json($testPart, 201);
    }

    public function show($id): JsonResponse
    {
        $testPart = $this->testPartService->find($id);
        return response()->json($testPart);
    }

    public function update(UpdateTestPartRequest $request, $id): JsonResponse
    {
        $testPart = $this->testPartService->update($id, $request->validated());
        return response()->json($testPart);
    }

    public function destroy($id): JsonResponse
    {
        $this->testPartService->deleteTestPart($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}
