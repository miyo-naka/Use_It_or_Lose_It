<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'word' => 'required|string|max:255|unique:words',
            'meaning' => 'required|string|max:255',
            'part_of_speech' => 'required|string|max:50',
            'example_sentence' => 'nullable|string|max:1000',
        ];
    }
} 