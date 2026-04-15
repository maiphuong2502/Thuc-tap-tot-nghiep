<?php

namespace App\Services;

interface McqAnswerServiceInterface extends BaseServiceInterface
{
    public function getAllPaginated(int $perPage, array $filters = []);
}
