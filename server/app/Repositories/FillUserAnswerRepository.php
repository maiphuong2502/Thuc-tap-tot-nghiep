<?php

namespace App\Repositories;

use App\Models\FillUserAnswer;

class FillUserAnswerRepository extends BaseRepository implements FillUserAnswerRepositoryInterface
{
    public function getModel()
    {
        return FillUserAnswer::class;
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
