<?php

namespace App\Services;

use App\Repositories\SkillRepositoryInterface;

class SkillService extends BaseService implements SkillServiceInterface
{
    /**
     * Get repository
     * @return string
     */
    public function getRepository()
    {
        return SkillRepositoryInterface::class;
    }

    /**
     * Get all skills ordered by ID for index API
     */
    public function getSkillsList()
    {
        return $this->repository->getSkillsOrderedById();
    }
}
