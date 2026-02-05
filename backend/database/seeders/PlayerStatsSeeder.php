<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Player;
use App\Models\PlayerStats;
use Illuminate\Database\Seeder;

class PlayerStatsSeeder extends Seeder
{
    public function run(): void
    {
        $games = Game::all();
        $players = Player::all();

        foreach ($games as $game) {
            $randomPlayers = $players->random(min(10, $players->count()));
            foreach ($randomPlayers as $player) {
                PlayerStats::create([
                    'player_id' => $player->id,
                    'game_id' => $game->id,
                    'stats' => [
                        'points' => rand(0, 35),
                        'rebounds' => rand(0, 15),
                        'assists' => rand(0, 10),
                        'steals' => rand(0, 5),
                        'blocks' => rand(0, 5),
                        'turnovers' => rand(0, 8),
                        'fouls' => rand(0, 6),
                        'field_goals_made' => rand(0, 15),
                        'field_goals_attempted' => rand(5, 25),
                        'three_pointers_made' => rand(0, 8),
                        'three_pointers_attempted' => rand(0, 12),
                        'free_throws_made' => rand(0, 10),
                        'free_throws_attempted' => rand(0, 12),
                    ],
                    'games_played' => 1,
                ]);
            }
        }
    }
}