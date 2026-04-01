<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFillAnswerRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'question_id' => 'required|string|exists:fill_questions,question_id',
            'correct_answer' => 'required|string|max:255',
        ];
    }
    
    public function messages()
    {
        return [
            'question_id.required' => 'Câu hỏi không được để trống.',
            'question_id.exists' => 'Câu hỏi không tồn tại trong hệ thống.',
            'correct_answer.required' => 'Nội dung đáp án đúng không được để trống.',
        ];
    }
}
