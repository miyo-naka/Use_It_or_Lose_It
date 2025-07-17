<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'word' => [
                'required',
                'string',
                'max:255',
                Rule::unique('words')->ignore($this->route('word')->id ?? null),
            ],
            'meaning' => 'required|string|max:255',
            'part_of_speech' => 'required|string|max:50',
            'example_sentence' => 'nullable|string|max:1000',
        ];
    }
} 