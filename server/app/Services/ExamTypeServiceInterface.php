<?php

namespace App\Services;

interface ExamTypeServiceInterface extends BaseServiceInterface
{
    public function getExamTypesList();
    public function createExamType(array $data);
    public function updateExamType(int $id, array $data);
    public function deleteExamType(int $id);
}
