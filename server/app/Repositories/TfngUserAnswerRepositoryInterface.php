<?php

namespace App\Repositories;

interface TfngUserAnswerRepositoryInterface extends BaseRepositoryInterface
{
    public function getPaginated(int $perPage, array $filters = []);
}
