<?php

namespace App\Services;

use App\Repositories\MatchingUserAnswerRepositoryInterface;

class MatchingUserAnswerService extends BaseService implements MatchingUserAnswerServiceInterface
{
    public function getRepository()
    {
        return MatchingUserAnswerRepositoryInterface::class;
    }

    public function getAllPaginated(int $perPage, array $filters = [])
    {
        return $this->repository->getPaginated($perPage, $filters);
    }
}
