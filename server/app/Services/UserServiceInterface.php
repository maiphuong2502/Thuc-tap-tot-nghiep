<?php

namespace App\Services;

interface UserServiceInterface extends BaseServiceInterface
{
    /**
     * Lấy danh sách tài khoản
     * @return mixed
     */
    public function getUsersList();

    /**
     * Tạo tài khoản mới
     * @param array $data
     * @return mixed
     */
    public function createUser(array $data);

    /**
     * Cập nhật tài khoản
     * @param int $userId
     * @param array $data
     * @param mixed $authUser
     * @return array
     */
    public function updateUser(int $userId, array $data, $authUser);

    /**
     * Xóa tài khoản
     * @param int $userId
     * @param mixed $authUser
     * @return array
     */
    public function deleteUser(int $userId, $authUser);
}
