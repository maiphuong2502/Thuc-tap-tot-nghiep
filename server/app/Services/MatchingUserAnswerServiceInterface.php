<?php

namespace App\Services;

interface MatchingUserAnswerServiceInterface extends BaseServiceInterface
{
    public function getAllPaginated(int $perPage, array $filters = []);
}
