<?php

namespace App\Repositories;

interface ResultRepositoryInterface extends BaseRepositoryInterface
{
    public function getPaginated(int $perPage, array $filters = []);
    public function getByUserId(string $userId);
}
