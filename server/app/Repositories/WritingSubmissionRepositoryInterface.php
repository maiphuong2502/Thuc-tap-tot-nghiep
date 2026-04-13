<?php

namespace App\Repositories;

interface WritingSubmissionRepositoryInterface extends BaseRepositoryInterface
{
    public function getPaginated(int $perPage, array $filters = []);
}
