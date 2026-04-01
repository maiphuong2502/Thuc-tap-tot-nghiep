<?php

namespace App\Services;

use App\Repositories\DropdownQuestionRepositoryInterface;
use App\Models\Question;
use Exception;

class DropdownQuestionService extends BaseService implements DropdownQuestionServiceInterface
{
    public function __construct(DropdownQuestionRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }


    public function getRepository()
    {
        return DropdownQuestionRepositoryInterface::class;
    }

    public function create(array $data)
    {
        $question = Question::find($data['question_id']);

        if (!$question) {
            throw new Exception('Câu hỏi gốc không tồn tại.');
        }

        if ($question->question_type !== 'DROPDOWN') {
            throw new Exception('Câu hỏi gốc phải có loại là DROPDOWN.');
        }

        return parent::create($data);
    }
}
