<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SkillServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkillController extends Controller
{

    private const ROLE_ADMIN = 0;

    protected $skillService;

    public function __construct(SkillServiceInterface $skillService)
    {
        $this->skillService = $skillService;
    }

    /**
     * Lấy danh sách kỹ năng.
     * Chỉ admin được phép xem.
     */
    public function index(): JsonResponse
    {

        $skills = $this->skillService->getSkillsList();

        return response()->json([
            'success' => true,
            'data' => $skills,
        ]);
    }

}