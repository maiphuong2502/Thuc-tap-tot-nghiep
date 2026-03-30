<?php

namespace App\Repositories;

use App\Models\McqOption;

class McqOptionRepository extends BaseRepository implements McqOptionRepositoryInterface
{
    /**
     * Get model
     * @return string
     */
    public function getModel()
    {
        return McqOption::class;
    }
}
