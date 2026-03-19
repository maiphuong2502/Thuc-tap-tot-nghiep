<?php

namespace App\Repositories;

use App\Models\ExamType;

class ExamTypeRepository extends BaseRepository implements ExamTypeRepositoryInterface
{
    public function getModel()
    {
        return ExamType::class;
    }

    public function getExamTypesOrdered()
    {
        return $this->model
            ->orderBy('category_id', 'asc')
            ->get();
    }
}
