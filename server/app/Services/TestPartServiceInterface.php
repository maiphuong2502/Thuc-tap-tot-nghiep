<?php

namespace App\Services;

interface TestPartServiceInterface extends BaseServiceInterface
{
    /**
     * Get list of test parts with search and filter
     */
    public function getTestParts(array $filters = [], int $perPage = 10);
    
    /**
     * Delete test part
     */
    public function deleteTestPart(string $id);
}
