<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTfngAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'question_id'    => 'sometimes|string|max:10|exists:tfng_questions,question_id',
            'correct_answer' => 'required|in:TRUE,FALSE,NOT GIVEN',
        ];
    }
}
