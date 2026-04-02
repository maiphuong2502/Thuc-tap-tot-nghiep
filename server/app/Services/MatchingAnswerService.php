<?php

namespace App\Services;

use App\Repositories\MatchingAnswerRepositoryInterface;
use App\Models\MatchingAnswer;
use Exception;

class MatchingAnswerService extends BaseService implements MatchingAnswerServiceInterface
{
    public function getRepository()
    {
        return MatchingAnswerRepositoryInterface::class;
    }

    public function create(array $data)
    {
        // Kiểm tra xem left_item đã tồn tại trong cùng question_id hay chưa
        $exists = MatchingAnswer::where('question_id', $data['question_id'])
            ->where('left_item', $data['left_item'])
            ->exists();
            
        if ($exists) {
            throw new Exception("Vế trái '{$data['left_item']}' đã tồn tại trong câu hỏi này.");
        }

        return parent::create($data);
    }

    public function update($id, array $data)
    {
        $matchingAnswer = $this->find($id);
        if (!$matchingAnswer) {
            throw new Exception("Không tìm thấy đáp án nối.");
        }

        if (isset($data['left_item'])) {
            $exists = MatchingAnswer::where('question_id', $data['question_id'])
                ->where('left_item', $data['left_item'])
                ->where('answer_id', '!=', $id)
                ->exists();
                
            if ($exists) {
                throw new Exception("Vế trái '{$data['left_item']}' đã tồn tại trong câu hỏi này.");
            }
        }

        return parent::update($id, $data);
    }

    public function delete($id)
    {
        $matchingAnswer = $this->find($id);
        if (!$matchingAnswer) {
            throw new Exception("Không tìm thấy đáp án nối.");
        }

        $count = MatchingAnswer::where('question_id', $matchingAnswer->question_id)->count();
        if ($count <= 2) {
            throw new Exception("Câu hỏi phải có ít nhất 2 cặp nối.");
        }

        return parent::delete($id);
    }
}
