<?php

namespace App\Services;

use App\Repositories\WritingSubmissionRepositoryInterface;
use App\Models\User;
use App\Models\Question;
use Illuminate\Validation\ValidationException;

class WritingSubmissionService implements WritingSubmissionServiceInterface
{
    protected $repository;

    public function __construct(WritingSubmissionRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getList(int $perPage = 10, array $filters = [])
    {
        return $this->repository->getPaginated($perPage, $filters);
    }

    public function getById($id)
    {
        return $this->repository->findOrFail($id);
    }

    public function create(array $data)
    {
        // Valdiate user exists (user_id is string like UR01)
        if (!empty($data['user_id'])) {
            $user = User::where('user_id', $data['user_id'])->first();
            if (!$user) {
                throw ValidationException::withMessages(['user_id' => 'Người dùng không tồn tại.']);
            }
        }

        // Validate question exists
        if (!empty($data['question_id'])) {
            $question = Question::where('question_id', $data['question_id'])->first();
            if (!$question) {
                throw ValidationException::withMessages(['question_id' => 'Câu hỏi không tồn tại.']);
            }
        }

        return $this->repository->create($data);
    }

    public function update($id, array $data)
    {
        $this->repository->findOrFail($id);

        if (!empty($data['user_id'])) {
            $user = User::where('user_id', $data['user_id'])->first();
            if (!$user) {
                throw ValidationException::withMessages(['user_id' => 'Người dùng không tồn tại.']);
            }
        }

        if (!empty($data['question_id'])) {
            $question = Question::where('question_id', $data['question_id'])->first();
            if (!$question) {
                throw ValidationException::withMessages(['question_id' => 'Câu hỏi không tồn tại.']);
            }
        }

        return $this->repository->update($id, $data);
    }

    public function delete($id)
    {
        $this->repository->findOrFail($id);
        return $this->repository->delete($id);
    }
}
