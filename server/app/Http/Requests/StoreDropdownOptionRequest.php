<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDropdownOptionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'option_id' => 'nullable|string|max:10|unique:dropdown_options,option_id',
            'question_id' => 'required|string|max:10|exists:dropdown_questions,question_id',
            'content' => 'required|string|max:255',
            'is_correct' => 'required|boolean',
        ];
    }
}
