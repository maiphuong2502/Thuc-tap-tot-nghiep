<?php

namespace App\Services;

use App\Repositories\FillAnswerRepositoryInterface;
use App\Models\FillAnswer;
use Exception;

class FillAnswerService extends BaseService implements FillAnswerServiceInterface
{
    public function getRepository()
    {
        return FillAnswerRepositoryInterface::class;
    }

    public function delete($id)
    {
        $answer = $this->find($id);
        if (!$answer) {
            throw new Exception("Không tìm thấy đáp án này.");
        }

        $questionId = $answer->question_id;
        
        // Count how many answers this question has
        $answerCount = FillAnswer::where('question_id', $questionId)->count();
        
        if ($answerCount <= 1) {
            throw new Exception("Phải có ít nhất 1 đáp án đúng.");
        }

        return parent::delete($id);
    }
}
