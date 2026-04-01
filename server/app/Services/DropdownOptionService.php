<?php

namespace App\Services;

use App\Repositories\DropdownOptionRepositoryInterface;
use App\Models\DropdownOption;
use Exception;

class DropdownOptionService extends BaseService implements DropdownOptionServiceInterface
{
    public function getRepository()
    {
        return DropdownOptionRepositoryInterface::class;
    }

    public function create(array $data)
    {
        // Auto-generate option_id if not provided
        if (empty($data['option_id'])) {
            $data['option_id'] = $this->repository->generateOptionId();
        }

        // Kiểm tra nghiệp vụ: Chỉ cho phép 1 đáp án đúng (is_correct = true) cho mỗi câu hỏi
        if (isset($data['is_correct']) && $data['is_correct'] == true) {
            $existingCorrect = DropdownOption::where([
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
        $option = $this->repository->find($id);
        if (!$option) {
            throw new Exception("Không tìm thấy đáp án chọn từ.");
        }

        // Kiểm tra nghiệp vụ: Nếu sửa thành đáp án đúng, phải đảm bảo câu hỏi đó chưa có đáp án đúng nào khác
        if (isset($data['is_correct']) && $data['is_correct'] == true && !$option->is_correct) {
            $question_id = $data['question_id'] ?? $option->question_id;

            $existingCorrect = DropdownOption::where([
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
        $option = $this->repository->find($id);
        if (!$option) {
            throw new Exception("Không tìm thấy đáp án chọn từ.");
        }

        // Kiểm tra nghiệp vụ: Không cho phép xóa nếu đây là đáp án đúng duy nhất
        if ($option->is_correct) {
            $otherCorrect = DropdownOption::where([
                'question_id' => $option->question_id,
                'is_correct' => true
            ])->where('option_id', '!=', $id)->first();

            if (!$otherCorrect) {
                throw new Exception("Phải tồn tại một đáp án đúng cho câu hỏi.");
            }
        }

        return parent::delete($id);
    }
}
