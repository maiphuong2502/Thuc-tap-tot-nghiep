<?php

namespace App\Repositories;

use App\Models\Question;

class QuestionRepository extends BaseRepository implements QuestionRepositoryInterface
{
    public function getModel()
    {
        return Question::class;
    }

    public function getPaginatedQuestions(int $perPage = 10, array $filters = [])
    {
        $query = $this->model->with(['group', 'skill']);

        if (!empty($filters['skill'])) {
            $query->where('skill_id', $filters['skill']);
        }

        if (!empty($filters['type'])) {
            $query->where('question_type', $filters['type']);
        }

        if (!empty($filters['group'])) {
            $query->where('group_id', $filters['group']);
        }
        
        // Mặc định sắp xếp theo group và order_index
        $query->orderBy('group_id', 'asc')->orderBy('order_index', 'asc');

        return $query->paginate($perPage);
    }

    public function checkOrderIndexExists(string $groupId, int $orderIndex, ?string $excludeQuestionId = null): bool
    {
        $query = $this->model->where('group_id', $groupId)->where('order_index', $orderIndex);
        
        if ($excludeQuestionId) {
            $query->where('question_id', '!=', $excludeQuestionId);
        }

        return $query->exists();
    }
}
