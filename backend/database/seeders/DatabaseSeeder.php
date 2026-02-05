<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            RoleSeeder::class,
            SportSeeder::class,
            UserSeeder::class,
            DivisionSeeder::class,
            SeasonSeeder::class,
            VenueSeeder::class,
            PlayerSeeder::class,
            TeamSeeder::class,
            TeamPlayerSeeder::class,
        ]);
    }
}
