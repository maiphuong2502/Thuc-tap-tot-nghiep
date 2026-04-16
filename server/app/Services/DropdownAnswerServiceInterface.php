<?php

namespace App\Services;

interface DropdownAnswerServiceInterface extends BaseServiceInterface
{
    public function getAllPaginated(int $perPage, array $filters = []);
}
