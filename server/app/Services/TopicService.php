<?php

namespace App\Services;

use App\Repositories\TopicRepositoryInterface;

class TopicService extends BaseService implements TopicServiceInterface
{
    /**
     * Get repository
     * @return string
     */
    public function getRepository()
    {
        return TopicRepositoryInterface::class;
    }

    /**
     * Get all topics ordered by ID for index API
     */
    public function getTopicsList()
    {
        return $this->repository->getTopicsOrderedById();
    }
}
