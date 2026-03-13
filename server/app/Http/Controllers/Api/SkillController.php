<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkillController extends Controller
{

    private const ROLE_ADMIN = 0;

    /**
     * Lấy danh sách kỹ năng.
     * Chỉ admin được phép xem.
     */
    public function index(Request $request): JsonResponse
    {
        $authUser = $request->user();
        if (!$authUser || (int) $authUser->role !== self::ROLE_ADMIN) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền truy cập chức năng này.',
            ], 403);
        }

        $skills = Skill::query()
            ->orderBy('id')
            ->get(['id', 'skill_name', 'description']);

        return response()->json([
            'success' => true,
            'data' => $skills,
        ]);
    }

}