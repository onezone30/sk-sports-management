<?php

namespace App\Http\Requests;

use App\Enums\Gender;
use App\Enums\Status;
use App\Models\Player;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePlayerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['sometimes', 'required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['sometimes', 'required', 'string', 'max:255'],
            'suffix' => ['nullable', 'string', 'max:20'],
            'date_of_birth' => ['sometimes', 'required', 'date', 'before:today'],
            'gender' => ['sometimes', 'required', Rule::enum(Gender::class)],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:30'],
            'status' => ['sometimes', 'required', Rule::enum(Status::class)],
        ];
    }

    /** See StorePlayerRequest::withValidator() for why this isn't a Rule::unique(). */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            /** @var Player|null $player */
            $player = $this->route('player');

            $firstName = $this->input('first_name', $player?->first_name);
            $lastName = $this->input('last_name', $player?->last_name);
            $dateOfBirth = $this->input('date_of_birth', $player?->date_of_birth?->toDateString());

            if (! $firstName || ! $lastName || ! $dateOfBirth) {
                return;
            }

            $exists = Player::query()
                ->where('first_name', $firstName)
                ->where('last_name', $lastName)
                ->whereDate('date_of_birth', $dateOfBirth)
                ->when($player, fn ($query) => $query->whereKeyNot($player->id))
                ->exists();

            if ($exists) {
                $validator->errors()->add('date_of_birth', 'A player with this name and date of birth is already registered.');
            }
        });
    }
}
