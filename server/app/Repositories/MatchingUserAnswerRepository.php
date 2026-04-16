<?php

namespace App\Repositories;

use App\Models\MatchingUserAnswer;

class MatchingUserAnswerRepository extends BaseRepository implements MatchingUserAnswerRepositoryInterface
{
    public function getModel()
    {
        return MatchingUserAnswer::class;
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
