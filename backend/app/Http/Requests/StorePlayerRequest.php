<?php

namespace App\Http\Requests;

use App\Enums\Gender;
use App\Enums\Status;
use App\Models\Player;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePlayerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'suffix' => ['nullable', 'string', 'max:20'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'gender' => ['required', Rule::enum(Gender::class)],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:30'],
            'status' => ['sometimes', 'required', Rule::enum(Status::class)],
        ];
    }

    /**
     * Cross-field duplicate check (first_name + last_name + date_of_birth).
     * A plain Rule::unique() with a where() closure compares the raw request
     * string against the DB's stored datetime-formatted column and misses
     * matches — whereDate() compares the actual calendar date instead.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if (! $this->filled(['first_name', 'last_name', 'date_of_birth'])) {
                return;
            }

            $exists = Player::query()
                ->where('first_name', $this->first_name)
                ->where('last_name', $this->last_name)
                ->whereDate('date_of_birth', $this->date_of_birth)
                ->exists();

            if ($exists) {
                $validator->errors()->add('date_of_birth', 'A player with this name and date of birth is already registered.');
            }
        });
    }
}
