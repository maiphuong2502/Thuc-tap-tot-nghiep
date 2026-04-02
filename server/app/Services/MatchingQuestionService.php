<?php

namespace App\Services;

use App\Repositories\MatchingQuestionRepositoryInterface;
use App\Models\Question;
use App\Models\MatchingQuestion;
use Exception;

class MatchingQuestionService extends BaseService implements MatchingQuestionServiceInterface
{
    public function getRepository()
    {
        return MatchingQuestionRepositoryInterface::class;
    }

    public function create(array $data)
    {
        if (empty($data['question_id'])) {
            throw new Exception("question_id là bắt buộc.");
        }

        // Kiểm tra xem question_id có tồn tại trong bảng questions không
        $question = Question::find($data['question_id']);
        if (!$question) {
            throw new Exception("Câu hỏi gốc (questions) không tồn tại.");
        }

        // Kiểm tra question_type có phải là matching không
        if ($question->question_type !== 'matching') {
            throw new Exception("Loại câu hỏi (question_type) phải là 'matching'.");
        }

        // Kiểm tra xem đã tồn tại trong bảng matching_questions chưa
        $existing = MatchingQuestion::find($data['question_id']);
        if ($existing) {
            throw new Exception("Câu hỏi nối này đã tồn tại trong hệ thống.");
        }

        return parent::create($data);
    }

    public function delete($id)
    {
        $matchingQuestion = $this->find($id);
        if (!$matchingQuestion) {
            throw new Exception("Không tìm thấy câu hỏi nối.");
        }

        $baseQuestion = Question::find($id);
        if ($baseQuestion && !empty($baseQuestion->group_id)) {
            throw new Exception("Câu hỏi đang được sử dụng");
        }

        return parent::delete($id);
    }
}
