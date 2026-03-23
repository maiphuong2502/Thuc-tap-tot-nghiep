<?php

namespace App\Repositories;

interface PassageRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get all passages ordered by ID
     * @return mixed
     */
    public function getPassagesOrderedById();
}
