<?php

namespace App\Repositories;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get all users ordered by created_at DESC
     * @return mixed
     */
    public function getUsersOrderDesc();
}
