<?php

namespace App\Repositories;

interface MatchingUserAnswerRepositoryInterface extends BaseRepositoryInterface
{
    public function getPaginated(int $perPage, array $filters = []);
}
