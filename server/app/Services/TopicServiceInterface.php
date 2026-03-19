<?php

namespace App\Services;

interface TopicServiceInterface extends BaseServiceInterface
{
    /**
     * Get all topics ordered by ID for index API
     */
    public function getTopicsList();
}
