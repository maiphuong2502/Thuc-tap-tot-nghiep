<?php

namespace App\Repositories;

use App\Models\TfngQuestion;

class TfngQuestionRepository extends BaseRepository implements TfngQuestionRepositoryInterface
{
    public function getModel()
    {
        return TfngQuestion::class;
    }
}
