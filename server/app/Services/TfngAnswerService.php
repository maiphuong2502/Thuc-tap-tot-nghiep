<?php

namespace App\Services;

use App\Repositories\TfngAnswerRepositoryInterface;
use App\Models\TfngAnswer;
use App\Models\TfngQuestion;
use Exception;

class TfngAnswerService extends BaseService implements TfngAnswerServiceInterface
{
    public function getRepository()
    {
        return TfngAnswerRepositoryInterface::class;
    }

    public function create(array $data)
    {
        if (empty($data['answer_id'])) {
            throw new Exception("answer_id là bắt buộc.");
        }
        if (empty($data['question_id'])) {
            throw new Exception("question_id là bắt buộc.");
        }
        if (empty($data['correct_answer'])) {
            throw new Exception("correct_answer là bắt buộc.");
        }

        // Kiểm tra tfng_question tồn tại
        $question = TfngQuestion::find($data['question_id']);
        if (!$question) {
            throw new Exception("Câu hỏi TFNG không tồn tại.");
        }

        // Kiểm tra answer_id chưa tồn tại
        $existing = TfngAnswer::find($data['answer_id']);
        if ($existing) {
            throw new Exception("Answer ID '{$data['answer_id']}' đã tồn tại trong hệ thống.");
        }

        return parent::create($data);
    }

    public function update($id, array $data)
    {
        $tfngAnswer = $this->find($id);
        if (!$tfngAnswer) {
            throw new Exception("Không tìm thấy đáp án TFNG.");
        }

        // Nếu đổi question_id, kiểm tra tồn tại
        if (isset($data['question_id']) && $data['question_id'] !== $tfngAnswer->question_id) {
            $question = TfngQuestion::find($data['question_id']);
            if (!$question) {
                throw new Exception("Câu hỏi TFNG không tồn tại.");
            }
        }

        return parent::update($id, $data);
    }

    public function delete($id)
    {
        $tfngAnswer = $this->find($id);
        if (!$tfngAnswer) {
            throw new Exception("Không tìm thấy đáp án TFNG.");
        }

        $count = TfngAnswer::where('question_id', $tfngAnswer->question_id)->count();
        if ($count <= 1) {
            throw new Exception("Mỗi câu hỏi phải có một đáp án đúng.");
        }

        return parent::delete($id);
    }
}
