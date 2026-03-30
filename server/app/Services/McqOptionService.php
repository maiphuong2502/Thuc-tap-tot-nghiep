<?php

namespace App\Services;

use App\Repositories\McqOptionRepositoryInterface;
use App\Models\McqOption;
use Exception;

class McqOptionService extends BaseService implements McqOptionServiceInterface
{
    public function __construct(McqOptionRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    public function getRepository()
    {
        return McqOptionRepositoryInterface::class;
    }

    public function create(array $data)
    {
        // Require at least one true? Normally a question doesn't have true yet when creating first option
        // But the requirement says "Không được thêm nhiều đáp án có is_correct = true" for single choice
        if (isset($data['is_correct']) && $data['is_correct'] == true) {
            $existingCorrect = McqOption::where([
                'question_id' => $data['question_id'],
                'is_correct' => true
            ])->first();

            if ($existingCorrect) {
                throw new Exception("Câu hỏi này đã có đáp án đúng. Vui lòng bỏ chọn đáp án đúng nếu muốn thêm.");
            }
        }

        return parent::create($data);
    }

    public function update($id, array $data)
    {
        $option = $this->find($id);
        if (!$option) {
            throw new Exception("Không tìm thấy đáp án MCQ");
        }

        // Check if modifying is_correct to true, and if there's already another correct
        if (isset($data['is_correct']) && $data['is_correct'] == true && !$option->is_correct) {
            $question_id = $data['question_id'] ?? $option->question_id;

            $existingCorrect = McqOption::where([
                'question_id' => $question_id,
                'is_correct' => true
            ])->where('option_id', '!=', $id)->first();

            if ($existingCorrect) {
                throw new Exception("Câu hỏi này đã có đáp án đúng. Vui lòng bỏ chọn đáp án đúng của lựa chọn khác trước.");
            }
        }

        return parent::update($id, $data);
    }

    public function delete($id)
    {
        $option = $this->find($id);
        if (!$option) {
            throw new Exception("Không tìm thấy đáp án MCQ");
        }

        if ($option->is_correct) {
            // Check if it's the ONLY correct answer, but we might not allow deleting if there are other options?
            // Actually requirement says "Việc xóa làm câu hỏi không còn đáp án đúng -> Không cho phép xóa"
            // So if this option is_correct, we check if there are any other correct options. If not, don't allow.
            $otherCorrect = McqOption::where([
                'question_id' => $option->question_id,
                'is_correct' => true
            ])->where('option_id', '!=', $id)->first();

            if (!$otherCorrect) {
                throw new Exception("Câu hỏi phải có ít nhất một đáp án đúng");
            }
        }

        return parent::delete($id);
    }
}
