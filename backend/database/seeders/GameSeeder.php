<?php

namespace Database\Seeders;

use App\Enums\ActiveStatus;
use App\Models\Division;
use App\Models\Game;
use App\Models\Venue;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        $venues = Venue::all();
        $divisions = Division::with('teams')->get();

        foreach ($divisions as $division) {
            $teams = $division->teams;
            if ($teams->count() < 2) {
                continue;
            }

            Game::create([
                'home_team_id' => $teams[0]->id,
                'away_team_id' => $teams[1]->id,
                'venue_id' => $venues->random()->id,
                'home_score' => 0,
                'away_score' => 0,
                'status' => ActiveStatus::INACTIVE->value,
                'scheduled_at' => now()->addDays(rand(7, 60)),
            ]);

            Game::create([
                'home_team_id' => $teams[1]->id,
                'away_team_id' => $teams[0]->id,
                'venue_id' => $venues->random()->id,
                'home_score' => 0,
                'away_score' => 0,
                'status' => ActiveStatus::INACTIVE->value,
                'scheduled_at' => now()->addDays(rand(61, 120)),
            ]);
        }
    }
}
