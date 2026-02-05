<?php

namespace Database\Seeders;

use App\Models\Player;
use App\Models\Team;
use Illuminate\Database\Seeder;

class TeamPlayerSeeder extends Seeder
{
    public function run(): void
    {
        $teams = Team::all();
        $players = Player::all();

        foreach ($teams as $team) {
            $assignedPlayers = $players->random(min(15, $players->count()));
            foreach ($assignedPlayers as $player) {
                $team->teamPlayers()->create([
                    'player_id' => $player->id,
                    'jersey_number' => rand(1, 99),
                    'position' => $this->randomPosition(),
                ]);
            }
        }
    }

    private function randomPosition(): string
    {
        return collect(['point guard', 'shooting guard', 'small forward', 'power forward', 'center'])->random();
    }
}