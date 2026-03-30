<?php

namespace App\Repositories;

use App\Models\McqQuestion;

class McqQuestionRepository extends BaseRepository implements McqQuestionRepositoryInterface
{
    /**
     * Get model
     * @return string
     */
    public function getModel()
    {
        return McqQuestion::class;
    }
}
