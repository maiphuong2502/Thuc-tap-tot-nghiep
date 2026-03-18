<?php

namespace App\Repositories;

interface SkillRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get all skills ordered by ID
     * @return mixed
     */
    public function getSkillsOrderedById();
}
