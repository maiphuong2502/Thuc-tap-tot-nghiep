<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\UserServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    private const ROLE_ADMIN = 0;

    protected $userService;

    public function __construct(UserServiceInterface $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Danh sách tài khoản.
     * Chỉ admin được phép xem.
     */
    public function index(): JsonResponse
    {

        $users = $this->userService->getUsersList();

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * Thêm tài khoản mới.
     * Chỉ admin được phép thêm.
     */
    public function store(Request $request): JsonResponse
    {

        $validated = $request->validate([
            'username' => ['required', 'string', 'max:50'],
            'email'    => ['required', 'email', 'max:100', 'unique:users,email'],
            'password' => ['required', 'string', 'min:4'],
            'role'     => ['required', 'integer', Rule::in([0, 1])],
            'status'   => ['required', 'integer', Rule::in([0, 1])],
        ]);

        $user = $this->userService->createUser([
            'username' => $validated['username'],
            'email'    => $validated['email'],
            'password' => $validated['password'],
            'role'     => $validated['role'],
            'status'   => $validated['status'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thêm tài khoản thành công.',
            'data' => [
                'user_id'  => $user->user_id,
                'username' => $user->username,
                'email'    => $user->email,
                'role'     => $user->role,
                'status'   => $user->status,
                'created_at' => $user->created_at,
            ],
        ], 201);
    }

    /**
     * Cập nhật thông tin tài khoản.
     * Admin được sửa:
     * - Tài khoản của chính mình
     * - Các tài khoản role = user
     * Không được sửa tài khoản admin khác.
     */
    public function update(Request $request, int $userId): JsonResponse
    {
        $authUser = $request->user();

        $validated = $request->validate([
            'username' => ['sometimes', 'required', 'string', 'max:50'],
            'email'    => [
                'sometimes',
                'required',
                'email',
                'max:100',
                Rule::unique('users', 'email')->ignore($userId, 'user_id'),
            ],
            'password' => ['sometimes', 'nullable', 'string', 'min:4'],
            'role'     => ['sometimes', 'required', 'integer', Rule::in([0, 1])],
            'status'   => ['sometimes', 'required', 'integer', Rule::in([0, 1])],
        ]);

        // Filter out null password or unnecessary fields if needed, 
        // the validation already ensures what we get is valid.
        $data = array_filter($validated, function($value, $key) {
            if ($key === 'password' && $value === null) {
                return false;
            }
            return true;
        }, ARRAY_FILTER_USE_BOTH);

        $result = $this->userService->updateUser($userId, $data, $authUser);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], $result['status_code'] ?? 400);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
            'data' => $result['data'],
        ]);
    }

    /**
     * Xóa tài khoản.
     * Admin chỉ được xóa các tài khoản role = user.
     */
    public function destroy(Request $request, int $userId): JsonResponse
    {
        $authUser = $request->user();

        $result = $this->userService->deleteUser($userId, $authUser);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], $result['status_code'] ?? 400);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
        ]);
    }
}
