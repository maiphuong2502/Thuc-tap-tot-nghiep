<?php

namespace App\Repositories;

interface AudioRepositoryInterface extends BaseRepositoryInterface
{
    public function getAudiosOrderedById($search = null);
}
