<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMatchingUserAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'muw_id'      => 'required|string|max:10',
            'result_id'   => 'required|string|max:10|exists:results,result_id',
            'question_id' => 'required|string|max:10|exists:questions,question_id',
            'left_item'   => 'nullable|string',
            'right_item'  => 'nullable|string',
            'is_correct'  => 'required|boolean',
        ];
    }
}
