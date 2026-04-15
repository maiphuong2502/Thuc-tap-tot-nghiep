<?php

namespace App\Services;

use App\Repositories\McqAnswerRepositoryInterface;
use Exception;

class McqAnswerService extends BaseService implements McqAnswerServiceInterface
{
    public function getRepository()
    {
        return McqAnswerRepositoryInterface::class;
    }

    public function getAllPaginated(int $perPage, array $filters = [])
    {
        return $this->repository->getPaginated($perPage, $filters);
    }
}
