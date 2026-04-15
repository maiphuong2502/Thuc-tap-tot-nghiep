<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMcqAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amc_id' => 'required|string|max:10',
            'result_id' => 'required|string|max:10',
            'question_id' => 'required|string|max:10',
            'selected_option_id' => 'required|string|max:10',
            'is_correct' => 'required|boolean',
        ];
    }
}
