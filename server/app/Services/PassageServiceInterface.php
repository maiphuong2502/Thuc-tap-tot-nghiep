<?php

namespace App\Services;

interface PassageServiceInterface extends BaseServiceInterface
{
    /**
     * Get all passages ordered by ID for index API
     */
    public function getPassagesList();
}
