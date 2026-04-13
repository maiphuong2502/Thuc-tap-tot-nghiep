<?php

namespace App\Repositories;

use App\Models\SpeakingSubmission;

class SpeakingSubmissionRepository extends BaseRepository implements SpeakingSubmissionRepositoryInterface
{
    public function getModel()
    {
        return SpeakingSubmission::class;
    }

    public function getPaginated(int $perPage, array $filters = [])
    {
        $query = $this->model->newQuery();

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (!empty($filters['question_id'])) {
            $query->where('question_id', $filters['question_id']);
        }

        if (isset($filters['has_score'])) {
            if ($filters['has_score'] === 'yes') {
                $query->whereNotNull('score');
            } elseif ($filters['has_score'] === 'no') {
                $query->whereNull('score');
            }
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }
}
