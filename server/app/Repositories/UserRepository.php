<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    /**
     * Get model
     * @return string
     */
    public function getModel()
    {
        return User::class;
    }

    /**
     * Get all users ordered by created_at DESC
     * @return mixed
     */
    public function getUsersOrderDesc()
    {
        return $this->model
            ->orderByDesc('created_at')
            ->get(['user_id', 'username', 'email', 'role', 'status', 'created_at']);
    }
}
