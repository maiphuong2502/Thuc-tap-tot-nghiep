<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMcqOptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'option_id' => 'required|string|max:10|unique:mcq_options,option_id',
            'question_id' => 'required|string|exists:mcq_questions,question_id',
            'content' => 'required|string',
            'is_correct' => 'required|boolean',
        ];
    }
}
