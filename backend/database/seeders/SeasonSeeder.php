<?php

namespace Database\Seeders;

use App\Enums\SportsType;
use App\Models\Season;
use App\Models\Sport;
use App\Models\User;
use Illuminate\Database\Seeder;

class SeasonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $volleyball = Sport::where('name', SportsType::VOLLEYBALL)->first();
        $basketball = Sport::where('name', SportsType::BASKETBALL)->first();
        $handler = User::whereHas('role', fn($q) => $q->where('name', 'Admin'))->first();

        Season::create([
            'sport_id' => $volleyball->id,
            'handler_id' => $handler->id,
            'name' => '2026 Football Season',
            'year' => 2026,
            'status' => 'active',
        ]);

        Season::create([
            'sport_id' => $basketball->id,
            'handler_id' => $handler->id,
            'name' => '2026 Basketball Season',
            'year' => 2026,
            'status' => 'active',
        ]);
    }
}
