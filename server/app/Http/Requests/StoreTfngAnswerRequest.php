<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTfngAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'answer_id'      => 'required|string|max:10|unique:tfng_answers,answer_id',
            'question_id'    => 'required|string|max:10|exists:tfng_questions,question_id',
            'correct_answer' => 'required|in:TRUE,FALSE,NOT GIVEN',
        ];
    }
}
