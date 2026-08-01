<?php

namespace App\Http\Requests;

use App\Enums\ActiveStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $roleId = $this->route('role')?->id;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255', "unique:roles,name,{$roleId}"],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'required', Rule::enum(ActiveStatus::class)],
        ];
    }
}
