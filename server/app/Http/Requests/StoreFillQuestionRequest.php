<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFillQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Must exist in questions table, and must be unique in fill_questions table
        return [
            'question_id' => 'required|string|max:10|exists:questions,question_id|unique:fill_questions,question_id',
            'content' => 'required|string',
        ];
    }
}
