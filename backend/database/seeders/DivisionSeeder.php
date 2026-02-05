<?php

namespace Database\Seeders;

use App\Enums\SportsType;
use App\Models\Division;
use App\Models\Sport;
use Illuminate\Database\Seeder;

class DivisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $volleyball = Sport::where('name', SportsType::VOLLEYBALL )->first();
        $basketball = Sport::where('name', SportsType::BASKETBALL)->first();

        // Football divisions
        Division::create([
            'sport_id' => $volleyball->id,
            'min_age' => 12,
            'max_age' => 17,
            'name' => 'Junior',
        ]);

        Division::create([
            'sport_id' => $volleyball->id,
            'min_age' => 18,
            'max_age' => 35,
            'name' => 'Senior',
        ]);

        // Basketball divisions
        Division::create([
            'sport_id' => $basketball->id,
            'min_age' => 10,
            'max_age' => 16,
            'name' => 'Junior',
        ]);

        Division::create([
            'sport_id' => $basketball->id,
            'min_age' => 17,
            'max_age' => 40,
            'name' => 'Senior',
        ]);
    }
}
