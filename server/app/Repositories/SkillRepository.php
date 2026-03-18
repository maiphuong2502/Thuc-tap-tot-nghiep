<?php

namespace App\Repositories;

use App\Models\Skill;

class SkillRepository extends BaseRepository implements SkillRepositoryInterface
{
    /**
     * Get model
     * @return string
     */
    public function getModel()
    {
        return Skill::class;
    }

    /**
     * Get all skills ordered by ID
     * @return mixed
     */
    public function getSkillsOrderedById()
    {
        return $this->model
            ->orderBy('id')
            ->get(['id', 'skill_name', 'description']);
    }
}
