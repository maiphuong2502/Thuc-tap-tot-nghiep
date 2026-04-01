<?php

namespace App\Repositories;

use App\Models\FillQuestion;

class FillQuestionRepository extends BaseRepository implements FillQuestionRepositoryInterface
{
    /**
     * Get model
     * @return string
     */
    public function getModel()
    {
        return FillQuestion::class;
    }

    public function getAll()
    {
        // Join with questions table to return group_id and skill_id fields if needed, or eager load
        return $this->model->with('question')->get();
    }
}
