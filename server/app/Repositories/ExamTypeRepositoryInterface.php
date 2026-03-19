<?php

namespace App\Repositories;

interface ExamTypeRepositoryInterface extends BaseRepositoryInterface
{
    public function getExamTypesOrdered();
}
