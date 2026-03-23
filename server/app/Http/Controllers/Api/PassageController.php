<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PassageServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PassageController extends Controller
{
    protected $passageService;

    public function __construct(PassageServiceInterface $passageService)
    {
        // Require admin middleware
        // This is handled in routes/api.php generally, but we can keep standard constructor
        $this->passageService = $passageService;
    }

    /**
     * Get list of passages.
     */
    public function index(): JsonResponse
    {
        $passages = $this->passageService->getPassagesList();

        return response()->json([
            'success' => true,
            'data' => $passages,
        ]);
    }

    /**
     * Store a newly created passage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:passages,title',
            'content' => 'required|string',
        ]);

        $passage = $this->passageService->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Thêm đoạn văn thành công',
            'data' => $passage,
        ]);
    }

    /**
     * Update the specified passage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:passages,title,' . $id . ',passage_id',
            'content' => 'required|string',
        ]);

        $passage = $this->passageService->update($id, $validated);

        if (!$passage) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đoạn văn',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật đoạn văn thành công',
            'data' => $passage,
        ]);
    }

    /**
     * Remove the specified passage.
     */
    public function destroy($id): JsonResponse
    {
        $deleted = $this->passageService->delete($id);

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đoạn văn hoặc không thể xóa',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Xóa đoạn văn thành công',
        ]);
    }
}
