<?php

namespace App\Services;

interface SkillServiceInterface extends BaseServiceInterface
{
    /**
     * Get all skills ordered by ID for index API
     * @return mixed
     */
    public function getSkillsList();
}
