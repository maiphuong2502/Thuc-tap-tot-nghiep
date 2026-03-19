<?php

namespace App\Services;

use App\Repositories\ExamTypeRepositoryInterface;

class ExamTypeService extends BaseService implements ExamTypeServiceInterface
{
    public function getRepository()
    {
        return ExamTypeRepositoryInterface::class;
    }

    public function getExamTypesList()
    {
        return $this->repository->getExamTypesOrdered();
    }

    public function createExamType(array $data)
    {
        return $this->repository->create($data);
    }

    public function updateExamType(int $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteExamType(int $id)
    {
        return $this->repository->delete($id);
    }
}
