<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMatchingQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'question_id' => 'required|string|max:10|exists:questions,question_id|unique:matching_questions,question_id',
            'content' => 'required|string',
        ];
    }
}
