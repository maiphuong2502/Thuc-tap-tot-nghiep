<?php

namespace App\Repositories;

use App\Models\DropdownAnswer;

class DropdownAnswerRepository extends BaseRepository implements DropdownAnswerRepositoryInterface
{
    public function getModel()
    {
        return DropdownAnswer::class;
    }

    public function getPaginated(int $perPage, array $filters = [])
    {
        $query = $this->model->newQuery();

        if (!empty($filters['result_id'])) {
            $query->where('result_id', $filters['result_id']);
        }
        if (!empty($filters['question_id'])) {
            $query->where('question_id', $filters['question_id']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }
}
