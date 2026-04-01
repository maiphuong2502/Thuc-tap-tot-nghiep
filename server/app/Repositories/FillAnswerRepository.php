<?php

namespace App\Repositories;

use App\Models\FillAnswer;

class FillAnswerRepository extends BaseRepository implements FillAnswerRepositoryInterface
{
    public function getModel()
    {
        return FillAnswer::class;
    }
}
