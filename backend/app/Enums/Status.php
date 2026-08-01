<?php

namespace App\Enums;

enum Status: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case ARCHIVED = 'archived';
    case DONE = 'done';

    public function label(): string
    {
        return match ($this) {
            self::ACTIVE => 'Active',
            self::INACTIVE => 'Inactive',
            self::ARCHIVED => 'Archived',
            self::DONE => 'Done',
        };
    }

    public function variant(): string
    {
        return match ($this) {
            self::ACTIVE => 'default',
            self::INACTIVE => 'outline',
            self::ARCHIVED => 'secondary',
            self::DONE => 'default',
        };
    }

    public function isActive(): bool
    {
        return $this === self::ACTIVE;
    }

    /** @return array{value: string, label: string, variant: string} */
    public function toArray(): array
    {
        return [
            'value' => $this->value,
            'label' => $this->label(),
            'variant' => $this->variant(),
        ];
    }
}
