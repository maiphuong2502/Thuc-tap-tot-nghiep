<?php

namespace App\Services;

interface FillUserAnswerServiceInterface extends BaseServiceInterface
{
    public function getAllPaginated(int $perPage, array $filters = []);
}
