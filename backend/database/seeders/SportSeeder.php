<?php

namespace Database\Seeders;

use App\Enums\SportsType;
use App\Models\Sport;
use Illuminate\Database\Seeder;

class SportSeeder extends Seeder
{
    public function run(): void
    {

        Sport::create([
            'name' => SportsType::BASKETBALL,
            'category' => 'team',
            'max_players_per_team' => 5,
            'status' => 'active',
        ]);

        Sport::create([
            'name' => SportsType::VOLLEYBALL,
            'category' => 'team',
            'max_players_per_team' => 6,
            'status' => 'active',
        ]);

        Sport::create([
            'name' => SportsType::MOBILE_LEGENDS,
            'max_players_per_team' => 5,
            'status' => 'active',
        ]);
        
        Sport::create([
            'name' => SportsType::BADMINTON,
            'category' => 'team',
            'max_players_per_team' => 2,
            'status' => 'active',
        ]);
    }
}