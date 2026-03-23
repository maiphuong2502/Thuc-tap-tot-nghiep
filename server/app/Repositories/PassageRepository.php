<?php

namespace App\Repositories;

use App\Models\Passage;

class PassageRepository extends BaseRepository implements PassageRepositoryInterface
{
    /**
     * Get model
     * @return string
     */
    public function getModel()
    {
        return Passage::class;
    }

    /**
     * Get all passages ordered by ID
     * @return mixed
     */
    public function getPassagesOrderedById()
    {
        return $this->model
            ->orderBy('passage_id')
            ->get(['passage_id', 'title', 'content']);
    }
}
