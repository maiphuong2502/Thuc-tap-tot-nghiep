<?php

namespace App\Services;

use App\Repositories\FillUserAnswerRepositoryInterface;

class FillUserAnswerService extends BaseService implements FillUserAnswerServiceInterface
{
    public function getRepository()
    {
        return FillUserAnswerRepositoryInterface::class;
    }

    public function getAllPaginated(int $perPage, array $filters = [])
    {
        return $this->repository->getPaginated($perPage, $filters);
    }
}
