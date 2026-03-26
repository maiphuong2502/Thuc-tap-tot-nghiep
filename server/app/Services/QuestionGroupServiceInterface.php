<?php

namespace App\Services;

interface QuestionGroupServiceInterface extends BaseServiceInterface
{
    public function getQuestionGroups(array $filters = [], int $perPage = 10);
}
