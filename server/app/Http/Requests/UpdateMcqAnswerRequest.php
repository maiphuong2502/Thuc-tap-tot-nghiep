<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMcqAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'result_id' => 'sometimes|string|max:10',
            'question_id' => 'sometimes|string|max:10',
            'selected_option_id' => 'sometimes|string|max:10',
            'is_correct' => 'sometimes|boolean',
        ];
    }
}
