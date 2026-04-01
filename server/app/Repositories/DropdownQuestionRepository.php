<?php

namespace App\Repositories;

use App\Models\DropdownQuestion;

class DropdownQuestionRepository extends BaseRepository implements DropdownQuestionRepositoryInterface
{
    public function getModel()
    {
        return DropdownQuestion::class;
    }

    public function getAll()
    {
        return $this->model->with('question')->get();
    }
}
