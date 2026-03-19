<?php

namespace App\Repositories;

interface TopicRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get all topics ordered by ID
     * @return mixed
     */
    public function getTopicsOrderedById();
}
