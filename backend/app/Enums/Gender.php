<?php

namespace App\Enums;

enum Gender: string
{
    case MALE = 'male';
    case FEMALE = 'female';

    public function label(): string
    {
        return match ($this) {
            self::MALE => 'Male',
            self::FEMALE => 'Female',
        };
    }

    /** @return array{value: string, label: string} */
    public function toArray(): array
    {
        return [
            'value' => $this->value,
            'label' => $this->label(),
        ];
    }
}
