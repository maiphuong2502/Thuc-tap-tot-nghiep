<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDropdownAnswerRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'result_id'          => 'sometimes|string|max:10|exists:results,result_id',
            'question_id'        => 'sometimes|string|max:10|exists:questions,question_id',
            'selected_option_id' => 'sometimes|string|max:10|exists:dropdown_options,option_id',
            'is_correct'         => 'sometimes|boolean',
        ];
    }
}
