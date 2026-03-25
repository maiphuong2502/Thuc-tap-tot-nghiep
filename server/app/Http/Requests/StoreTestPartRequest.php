<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTestPartRequest extends FormRequest
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
            'test_id' => 'required|string|max:10|exists:tests,test_id',
            'skill_id' => 'required|string|max:10|exists:skills,id',
            'part_name' => 'required|string|max:255',
            'order_index' => 'required|integer|min:1',
        ];
    }
}
