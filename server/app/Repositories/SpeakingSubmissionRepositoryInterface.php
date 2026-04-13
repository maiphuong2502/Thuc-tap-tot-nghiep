<?php

namespace App\Repositories;

interface SpeakingSubmissionRepositoryInterface extends BaseRepositoryInterface
{
    public function getPaginated(int $perPage, array $filters = []);
}
