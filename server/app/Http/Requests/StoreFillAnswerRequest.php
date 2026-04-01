<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFillAnswerRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'answer_id' => 'required|string|max:10|unique:fill_answers,answer_id',
            'question_id' => 'required|string|exists:fill_questions,question_id',
            'correct_answer' => 'required|string|max:255',
        ];
    }
    
    public function messages()
    {
        return [
            'answer_id.required' => 'Mã đáp án không được để trống.',
            'answer_id.unique' => 'Mã đáp án này đã tồn tại.',
            'question_id.required' => 'Câu hỏi không được để trống.',
            'question_id.exists' => 'Câu hỏi không tồn tại trong hệ thống.',
            'correct_answer.required' => 'Nội dung đáp án đúng không được để trống.',
        ];
    }
}
