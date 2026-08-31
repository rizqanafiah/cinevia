<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMovieRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'genre' => ['required', 'string', 'max:100'],
            'duration_minutes' => ['required', 'integer', 'min:1'],
            'synopsis' => ['nullable', 'string', 'max:2000'],
            'poster' => ['nullable', 'image', 'max:2048'],
            'age_rating' => ['required', 'string', 'in:SU,R13,D17,D21'],
        ];
    }
}
