<?php

namespace Tests\Unit;

use App\Enums\Status;
use PHPUnit\Framework\TestCase;

class StatusTest extends TestCase
{
    public function test_label_returns_human_readable_text_for_each_case(): void
    {
        $this->assertSame('Active', Status::ACTIVE->label());
        $this->assertSame('Inactive', Status::INACTIVE->label());
        $this->assertSame('Archived', Status::ARCHIVED->label());
        $this->assertSame('Done', Status::DONE->label());
    }

    public function test_variant_returns_badge_variant_for_each_case(): void
    {
        $this->assertSame('default', Status::ACTIVE->variant());
        $this->assertSame('outline', Status::INACTIVE->variant());
        $this->assertSame('secondary', Status::ARCHIVED->variant());
        $this->assertSame('default', Status::DONE->variant());
    }

    public function test_is_active_is_true_only_for_the_active_case(): void
    {
        $this->assertTrue(Status::ACTIVE->isActive());
        $this->assertFalse(Status::INACTIVE->isActive());
        $this->assertFalse(Status::ARCHIVED->isActive());
        $this->assertFalse(Status::DONE->isActive());
    }

    public function test_to_array_returns_value_label_and_variant(): void
    {
        $this->assertSame([
            'value' => 'active',
            'label' => 'Active',
            'variant' => 'default',
        ], Status::ACTIVE->toArray());
    }
}
