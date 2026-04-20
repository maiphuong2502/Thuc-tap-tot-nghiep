<?php

namespace App\Services;

use App\Repositories\TfngUserAnswerRepositoryInterface;

class TfngUserAnswerService extends BaseService implements TfngUserAnswerServiceInterface
{
    public function getRepository()
    {
        return TfngUserAnswerRepositoryInterface::class;
    }

    public function getAllPaginated(int $perPage, array $filters = [])
    {
        return $this->repository->getPaginated($perPage, $filters);
    }
}
