<?php

namespace App\Repositories;

use App\Models\MatchingAnswer;

class MatchingAnswerRepository extends BaseRepository implements MatchingAnswerRepositoryInterface
{
    public function getModel()
    {
        return MatchingAnswer::class;
    }
}
