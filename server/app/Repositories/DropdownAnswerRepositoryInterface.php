<?php

namespace App\Repositories;

interface DropdownAnswerRepositoryInterface extends BaseRepositoryInterface
{
    public function getPaginated(int $perPage, array $filters = []);
}
