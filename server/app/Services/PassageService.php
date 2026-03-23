<?php

namespace App\Services;

use App\Repositories\PassageRepositoryInterface;

class PassageService extends BaseService implements PassageServiceInterface
{
    /**
     * Get repository
     * @return string
     */
    public function getRepository()
    {
        return PassageRepositoryInterface::class;
    }

    /**
     * Get all passages ordered by ID for index API
     */
    public function getPassagesList()
    {
        return $this->repository->getPassagesOrderedById();
    }
}
