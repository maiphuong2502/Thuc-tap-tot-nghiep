<?php

namespace App\Services;

interface TfngUserAnswerServiceInterface extends BaseServiceInterface
{
    public function getAllPaginated(int $perPage, array $filters = []);
}
