<?php

namespace Database\Seeders;

use App\Enums\ActiveStatus;
use App\Enums\SportsType;
use App\Models\Season;
use App\Models\Sport;
use Illuminate\Database\Seeder;

class SportSeeder extends Seeder
{
    public function run(): void
    {
        $volleyballSeason = Season::where('name', '2026 Volleyball Season')->first();
        $basketballSeason = Season::where('name', '2026 Basketball Season')->first();

        Sport::create([
            'season_id' => $volleyballSeason->id,
            'name' => SportsType::VOLLEYBALL,
            'category' => SportsType::VOLLEYBALL->category(),
            'max_players_per_team' => 6,
            'status' => ActiveStatus::ACTIVE->value,
        ]);

        Sport::create([
            'season_id' => $basketballSeason->id,
            'name' => SportsType::BASKETBALL,
            'category' => SportsType::BASKETBALL->category(),
            'max_players_per_team' => 5,
            'status' => ActiveStatus::ACTIVE->value,
        ]);
    }
}
