<?php

namespace App\Services;

use App\Repositories\DropdownAnswerRepositoryInterface;

class DropdownAnswerService extends BaseService implements DropdownAnswerServiceInterface
{
    public function getRepository()
    {
        return DropdownAnswerRepositoryInterface::class;
    }

    public function getAllPaginated(int $perPage, array $filters = [])
    {
        return $this->repository->getPaginated($perPage, $filters);
    }
}
