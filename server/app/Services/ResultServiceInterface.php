<?php

namespace App\Services;

interface ResultServiceInterface
{
    /**
     * Store a test result.
     * 
     * @param array $data ['user_id', 'test_id', 'answers', 'start_time', 'end_time']
     */
    public function storeResult(array $data);

    public function getAllPaginated(int $perPage, array $filters = []);

    public function getResultById(string $id);

    public function getReviewData(string $id);

    public function getUserResults(string $userId);
}
