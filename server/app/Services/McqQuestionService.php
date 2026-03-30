<?php

namespace App\Services;

use App\Repositories\McqQuestionRepositoryInterface;

class McqQuestionService extends BaseService implements McqQuestionServiceInterface
{
    public function __construct(McqQuestionRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    public function getRepository()
    {
        return McqQuestionRepositoryInterface::class;
    }
}
