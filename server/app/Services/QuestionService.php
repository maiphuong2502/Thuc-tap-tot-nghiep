<?php

namespace App\Services;

use App\Repositories\QuestionRepositoryInterface;
use App\Models\QuestionGroup;
use Illuminate\Validation\ValidationException;

class QuestionService implements QuestionServiceInterface
{
    protected $questionRepository;

    public function __construct(QuestionRepositoryInterface $questionRepository)
    {
        $this->questionRepository = $questionRepository;
    }

    public function getQuestionsList(int $perPage = 10, array $filters = [])
    {
        return $this->questionRepository->getPaginatedQuestions($perPage, $filters);
    }

    public function createQuestion(array $data)
    {
        // Require group_id
        if (empty($data['group_id'])) {
            throw ValidationException::withMessages(['group_id' => 'Group ID is required.']);
        }

        // Auto fetch skill_id based on group_id
        $group = QuestionGroup::find($data['group_id']);
        if (!$group) {
            throw ValidationException::withMessages(['group_id' => 'Group not found.']);
        }
        
        // Auto set skill_id
        $data['skill_id'] = $group->skill_id;

        // Normalize question_type to uppercase for consistency
        if (isset($data['question_type'])) {
            $data['question_type'] = strtoupper($data['question_type']);
        }

        // Check if order_index is unique within the group
        if ($this->questionRepository->checkOrderIndexExists($data['group_id'], $data['order_index'])) {
            throw ValidationException::withMessages(['order_index' => 'Order index already exists in this group.']);
        }

        return $this->questionRepository->create($data);
    }

    public function updateQuestion($id, array $data)
    {
        $question = $this->questionRepository->findOrFail($id);
        
        if (isset($data['group_id'])) {
            $group = QuestionGroup::find($data['group_id']);
            if (!$group) {
                throw ValidationException::withMessages(['group_id' => 'Group not found.']);
            }
            $data['skill_id'] = $group->skill_id;
        } else {
            $data['group_id'] = $question->group_id;
            $data['skill_id'] = $question->skill_id;
        }

        if (isset($data['order_index'])) {
            if ($this->questionRepository->checkOrderIndexExists($data['group_id'], $data['order_index'], $id)) {
                throw ValidationException::withMessages(['order_index' => 'Order index already exists in this group.']);
            }
        }

        return $this->questionRepository->update($id, $data);
    }

    public function deleteQuestion($id)
    {
        $question = $this->questionRepository->findOrFail($id);
        
        // Note: Xóa câu hỏi. Theo requirements, nếu câu hỏi đã có dữ liệu liên quan (answers, results, user_answer), 
        // không được xóa. Hiển thị "Câu hỏi đang được sử dụng".
        // Thực tế có thể check relation (ví dụ $question->answers()->exists() nếu bảng answers đã có). 
        // Hiện tại xử lý Exception từ DB foreign key violation.
        try {
            return $this->questionRepository->delete($id);
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === "23000") {
                throw ValidationException::withMessages(['general' => 'Câu hỏi đang được sử dụng và không thể xóa.']);
            }
            throw $e;
        }
    }

    public function getQuestionById($id)
    {
        return $this->questionRepository->findOrFail($id);
    }
}
