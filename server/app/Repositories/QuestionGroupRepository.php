<?php

namespace App\Repositories;

use App\Models\QuestionGroup;

class QuestionGroupRepository extends BaseRepository implements QuestionGroupRepositoryInterface
{
    public function __construct(QuestionGroup $model)
    {
        parent::__construct($model);
    }

    public function getModel()
    {
        return \App\Models\QuestionGroup::class;
    }
}
