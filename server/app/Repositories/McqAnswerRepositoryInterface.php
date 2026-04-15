<?php

namespace App\Repositories;

interface McqAnswerRepositoryInterface extends BaseRepositoryInterface
{
    public function getPaginated(int $perPage, array $filters = []);
}
