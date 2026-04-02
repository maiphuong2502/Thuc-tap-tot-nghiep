<?php

namespace App\Repositories;

use App\Models\MatchingQuestion;

class MatchingQuestionRepository extends BaseRepository implements MatchingQuestionRepositoryInterface
{
    public function getModel()
    {
        return MatchingQuestion::class;
    }
}
