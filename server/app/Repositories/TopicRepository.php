<?php

namespace App\Repositories;

use App\Models\Topic;

class TopicRepository extends BaseRepository implements TopicRepositoryInterface
{
    /**
     * Get model
     * @return string
     */
    public function getModel()
    {
        return Topic::class;
    }

    /**
     * Get all topics ordered by ID
     * @return mixed
     */
    public function getTopicsOrderedById()
    {
        return $this->model
            ->orderBy('topic_id')
            ->get(['topic_id', 'topic_name', 'description']);
    }
}
