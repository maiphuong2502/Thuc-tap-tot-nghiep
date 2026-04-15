<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFillUserAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'result_id'   => 'sometimes|string|max:10|exists:results,result_id',
            'question_id' => 'sometimes|string|max:10|exists:questions,question_id',
            'user_answer' => 'sometimes|nullable|string',
            'is_correct'  => 'sometimes|boolean',
        ];
    }
}
