<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMcqOptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // option_id will typically not be updatable, but if passed it must match the path or check uniqueness.
        // Assuming we route as /api/mcq-options/{id}, option_id is in the route.
        return [
            'question_id' => 'sometimes|required|string|exists:mcq_questions,question_id',
            'content' => 'sometimes|required|string',
            'is_correct' => 'sometimes|required|boolean',
        ];
    }
}
