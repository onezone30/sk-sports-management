<?php

namespace Database\Seeders;

use App\Enums\ActiveStatus;
use App\Models\Season;
use App\Models\User;
use Illuminate\Database\Seeder;

class SeasonSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::whereHas('role', fn($q) => $q->where('name', 'Admin'))->first();

        Season::create([
            'chairman_id' => $admin->id,
            'name' => '2026 Volleyball Season',
            'year' => 2026,
            'start_date' => '2026-03-01',
            'end_date' => '2026-08-31',
            'status' => ActiveStatus::ACTIVE->value,
        ]);

        Season::create([
            'chairman_id' => $admin->id,
            'name' => '2026 Basketball Season',
            'year' => 2026,
            'start_date' => '2026-04-01',
            'end_date' => '2026-09-30',
            'status' => ActiveStatus::ACTIVE->value,
        ]);
    }
}
