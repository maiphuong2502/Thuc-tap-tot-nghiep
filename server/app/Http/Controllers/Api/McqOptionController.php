<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Services\McqOptionServiceInterface;
use App\Http\Requests\StoreMcqOptionRequest;
use App\Http\Requests\UpdateMcqOptionRequest;
use Illuminate\Http\JsonResponse;

class McqOptionController extends Controller
{
    protected $mcqOptionService;

    public function __construct(McqOptionServiceInterface $mcqOptionService)
    {
        $this->mcqOptionService = $mcqOptionService;
    }

    public function index(): JsonResponse
    {
        $mcqOptions = $this->mcqOptionService->getAll();
        return response()->json([
            'success' => true,
            'data' => $mcqOptions
        ]);
    }

    public function store(StoreMcqOptionRequest $request): JsonResponse
    {
        try {
            $mcqOption = $this->mcqOptionService->create($request->validated());
            return response()->json([
                'success' => true,
                'message' => 'MCQ Option created successfully.',
                'data' => $mcqOption
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function show(string $id): JsonResponse
    {
        $mcqOption = $this->mcqOptionService->find($id);
        if (!$mcqOption) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
        return response()->json([
            'success' => true,
            'data' => $mcqOption
        ]);
    }

    public function update(UpdateMcqOptionRequest $request, string $id): JsonResponse
    {
        try {
            $mcqOption = $this->mcqOptionService->update($id, $request->validated());
            return response()->json([
                'success' => true,
                'message' => 'MCQ Option updated successfully.',
                'data' => $mcqOption
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $this->mcqOptionService->delete($id);
            return response()->json([
                'success' => true,
                'message' => 'MCQ Option deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
