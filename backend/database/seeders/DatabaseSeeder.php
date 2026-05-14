<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            SeasonSeeder::class,
            SportSeeder::class,
            DivisionSeeder::class,
            VenueSeeder::class,
            PlayerSeeder::class,
            TeamSeeder::class,
            TeamPlayerSeeder::class,
            GameSeeder::class,
            PlayerStatsSeeder::class,
        ]);
    }
}
