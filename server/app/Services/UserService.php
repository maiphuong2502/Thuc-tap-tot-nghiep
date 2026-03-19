<?php

namespace App\Services;

use App\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Log;

class UserService extends BaseService implements UserServiceInterface
{
    private const ROLE_ADMIN = 0;

    /**
     * Get repository
     * @return string
     */
    public function getRepository()
    {
        return UserRepositoryInterface::class;
    }

    /**
     * Lấy danh sách tài khoản
     * @return mixed
     */
    public function getUsersList()
    {
        return $this->repository->getUsersOrderDesc();
    }

    /**
     * Tạo tài khoản mới
     * @param array $data
     * @return mixed
     */
    public function createUser(array $data)
    {
        return $this->repository->create($data);
    }

    /**
     * Cập nhật tài khoản
     * @param int $userId
     * @param array $data
     * @param mixed $authUser
     * @return array
     */
    public function updateUser(int $userId, array $data, $authUser)
    {
        $user = $this->repository->findOrFail($userId);

        // Nếu tài khoản mục tiêu là admin khác -> không cho phép
        if ($authUser->user_id !== $user->user_id && (int) $user->role === self::ROLE_ADMIN) {
            return [
                'success' => false,
                'message' => 'Bạn không được phép sửa tài khoản admin khác.',
                'status_code' => 403
            ];
        }

        $updatedUser = $this->repository->update($userId, $data);

        return [
            'success' => true,
            'message' => 'Cập nhật tài khoản thành công.',
            'data' => [
                'user_id'  => $updatedUser->user_id,
                'username' => $updatedUser->username,
                'email'    => $updatedUser->email,
                'role'     => $updatedUser->role,
                'status'   => $updatedUser->status,
                'created_at' => $updatedUser->created_at,
            ]
        ];
    }

    /**
     * Xóa tài khoản
     * @param int $userId
     * @param mixed $authUser
     * @return array
     */
    public function deleteUser(int $userId, $authUser)
    {
        $user = $this->repository->findOrFail($userId);

        if ((int) $user->role === self::ROLE_ADMIN) {
            return [
                'success' => false,
                'message' => 'Bạn không được phép xóa tài khoản admin.',
                'status_code' => 403
            ];
        }

        $this->repository->delete($userId);

        return [
            'success' => true,
            'message' => 'Xóa tài khoản thành công.',
        ];
    }
}
