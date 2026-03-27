<?php

namespace App\Services;

interface QuestionServiceInterface
{
    /**
     * Get paginated questions list with filters.
     */
    public function getQuestionsList(int $perPage = 10, array $filters = []);

    /**
     * Create a new question.
     */
    public function createQuestion(array $data);

    /**
     * Update a question.
     */
    public function updateQuestion($id, array $data);

    /**
     * Delete a question.
     */
    public function deleteQuestion($id);
    
    /**
     * Get a specific question.
     */
    public function getQuestionById($id);
}
