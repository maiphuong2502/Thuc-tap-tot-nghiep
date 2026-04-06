<?php

namespace App\Repositories;

use App\Models\TfngAnswer;

class TfngAnswerRepository extends BaseRepository implements TfngAnswerRepositoryInterface
{
    public function getModel()
    {
        return TfngAnswer::class;
    }
}
