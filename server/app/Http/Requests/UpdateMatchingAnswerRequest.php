<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMatchingAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'question_id' => 'required|string|exists:matching_questions,question_id',
            'left_item' => 'required|string|max:255',
            'right_item' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'question_id.required' => 'Mã câu hỏi (question_id) là bắt buộc.',
            'question_id.exists' => 'Câu hỏi nối không tồn tại.',
            'left_item.required' => 'Nội dung vế trái là bắt buộc.',
            'right_item.required' => 'Nội dung vế phải là bắt buộc.',
        ];
    }
}
