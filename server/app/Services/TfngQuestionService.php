<?php

namespace App\Services;

use App\Repositories\TfngQuestionRepositoryInterface;
use App\Models\Question;
use App\Models\TfngQuestion;
use Exception;

class TfngQuestionService extends BaseService implements TfngQuestionServiceInterface
{
    public function getRepository()
    {
        return TfngQuestionRepositoryInterface::class;
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

        // Kiểm tra question_type có phải là tfng không
        if ($question->question_type !== 'tfng') {
            throw new Exception("Loại câu hỏi (question_type) phải là 'tfng'.");
        }

        // Kiểm tra xem đã tồn tại trong bảng tfng_questions chưa
        $existing = TfngQuestion::find($data['question_id']);
        if ($existing) {
            throw new Exception("Câu hỏi TFNG này đã tồn tại trong hệ thống.");
        }

        return parent::create($data);
    }

    public function delete($id)
    {
        $tfngQuestion = $this->find($id);
        if (!$tfngQuestion) {
            throw new Exception("Không tìm thấy câu hỏi TFNG.");
        }

        $baseQuestion = Question::find($id);
        if ($baseQuestion && !empty($baseQuestion->group_id)) {
            throw new Exception("Câu hỏi đang được sử dụng");
        }

        return parent::delete($id);
    }
}
