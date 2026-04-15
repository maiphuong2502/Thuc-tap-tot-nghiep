<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFillUserAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'faw_id'      => 'required|string|max:10',
            'result_id'   => 'required|string|max:10|exists:results,result_id',
            'question_id' => 'required|string|max:10|exists:questions,question_id',
            'user_answer' => 'nullable|string',
            'is_correct'  => 'required|boolean',
        ];
    }
}
