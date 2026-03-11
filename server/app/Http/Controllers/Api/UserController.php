<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    private const ROLE_ADMIN = 0;

    /**
     * Danh sách tài khoản.
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

        $users = User::query()
            ->orderByDesc('created_at')
            ->get(['user_id', 'username', 'email', 'role', 'status', 'created_at']);

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
        $authUser = $request->user();
        if (!$authUser || (int) $authUser->role !== self::ROLE_ADMIN) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền truy cập chức năng này.',
            ], 403);
        }

        $validated = $request->validate([
            'username' => ['required', 'string', 'max:50'],
            'email'    => ['required', 'email', 'max:100', 'unique:users,email'],
            'password' => ['required', 'string', 'min:4'],
            'role'     => ['required', 'integer', Rule::in([0, 1])],
            'status'   => ['required', 'integer', Rule::in([0, 1])],
        ]);

        // Lưu mật khẩu dạng thuần theo thiết kế hiện tại
        $user = User::create([
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
        if (!$authUser || (int) $authUser->role !== self::ROLE_ADMIN) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền truy cập chức năng này.',
            ], 403);
        }

        $user = User::findOrFail($userId);

        // Nếu tài khoản mục tiêu là admin khác -> không cho phép
        if ($authUser->user_id !== $user->user_id && (int) $user->role === self::ROLE_ADMIN) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không được phép sửa tài khoản admin khác.',
            ], 403);
        }

        $validated = $request->validate([
            'username' => ['sometimes', 'required', 'string', 'max:50'],
            'email'    => [
                'sometimes',
                'required',
                'email',
                'max:100',
                Rule::unique('users', 'email')->ignore($user->user_id, 'user_id'),
            ],
            'password' => ['sometimes', 'nullable', 'string', 'min:4'],
            // Cho phép admin tự đổi role/status của chính mình nếu cần,
            // nhưng vẫn giới hạn giá trị hợp lệ.
            'role'     => ['sometimes', 'required', 'integer', Rule::in([0, 1])],
            'status'   => ['sometimes', 'required', 'integer', Rule::in([0, 1])],
        ]);

        if (array_key_exists('username', $validated)) {
            $user->username = $validated['username'];
        }
        if (array_key_exists('email', $validated)) {
            $user->email = $validated['email'];
        }
        if (array_key_exists('role', $validated)) {
            $user->role = $validated['role'];
        }
        if (array_key_exists('status', $validated)) {
            $user->status = $validated['status'];
        }
        if (array_key_exists('password', $validated) && $validated['password'] !== null) {
            $user->password = $validated['password'];
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật tài khoản thành công.',
            'data' => [
                'user_id'  => $user->user_id,
                'username' => $user->username,
                'email'    => $user->email,
                'role'     => $user->role,
                'status'   => $user->status,
                'created_at' => $user->created_at,
            ],
        ]);
    }

    /**
     * Xóa tài khoản.
     * Admin chỉ được xóa các tài khoản role = user.
     */
    public function destroy(Request $request, int $userId): JsonResponse
    {
        $authUser = $request->user();
        if (!$authUser || (int) $authUser->role !== self::ROLE_ADMIN) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền truy cập chức năng này.',
            ], 403);
        }

        $user = User::findOrFail($userId);

        if ((int) $user->role === self::ROLE_ADMIN) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không được phép xóa tài khoản admin.',
            ], 403);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa tài khoản thành công.',
        ]);
    }
}

