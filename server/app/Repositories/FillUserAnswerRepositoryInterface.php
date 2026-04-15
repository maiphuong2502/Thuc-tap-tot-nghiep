<?php

namespace App\Repositories;

interface FillUserAnswerRepositoryInterface extends BaseRepositoryInterface
{
    public function getPaginated(int $perPage, array $filters = []);
}
