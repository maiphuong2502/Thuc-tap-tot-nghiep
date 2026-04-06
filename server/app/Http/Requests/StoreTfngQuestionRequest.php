<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTfngQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'question_id' => 'required|string|max:10|exists:questions,question_id|unique:tfng_questions,question_id',
            'content'     => 'required|string',
        ];
    }
}
