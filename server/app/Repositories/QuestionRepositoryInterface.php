<?php

namespace App\Repositories;

interface QuestionRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get paginated questions with optional filters.
     *
     * @param int $perPage
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPaginatedQuestions(int $perPage = 10, array $filters = []);

    /**
     * Check if order index exists for a group.
     *
     * @param string $groupId
     * @param int $orderIndex
     * @param string|null $excludeQuestionId
     * @return bool
     */
    public function checkOrderIndexExists(string $groupId, int $orderIndex, ?string $excludeQuestionId = null): bool;
}
