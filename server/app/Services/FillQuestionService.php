<?php

namespace App\Services;

use App\Repositories\FillQuestionRepositoryInterface;
use App\Models\Question;
use Exception;

class FillQuestionService extends BaseService implements FillQuestionServiceInterface
{
    public function __construct(FillQuestionRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    public function getRepository()
    {
        return FillQuestionRepositoryInterface::class;
    }

    public function create(array $data)
    {
        // Validate that the question exists and its type is 'FILL'
        $question = Question::find($data['question_id']);
        
        if (!$question) {
            throw new Exception("Câu hỏi gốc không tồn tại.");
        }

        if ($question->question_type !== 'FILL') {
            throw new Exception("Câu hỏi gốc phải có loại là FILL.");
        }

        return parent::create($data);
    }

    public function delete($id)
    {
        // Laravel foreign key onDelete('cascade') will actually delete the fill_question if the parent question is deleted.
        // But if deleting from fill_questions, we might just be removing the detail text.
        // If there's a requirement to block deletion because it's used in a test, 
        // the parent `questions` table would typically have the foreign key constraint to `test_parts`.
        // We will wrap this in a try-catch in the controller to catch QueryException.
        return parent::delete($id);
    }
}
