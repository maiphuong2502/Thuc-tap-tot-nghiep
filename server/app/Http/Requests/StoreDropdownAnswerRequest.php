<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDropdownAnswerRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'daw_id'             => 'required|string|max:10',
            'result_id'          => 'required|string|max:10|exists:results,result_id',
            'question_id'        => 'required|string|max:10|exists:questions,question_id',
            'selected_option_id' => 'required|string|max:10|exists:dropdown_options,option_id',
            'is_correct'         => 'required|boolean',
        ];
    }
}
