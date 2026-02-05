<?php

namespace Database\Seeders;

use App\Models\Venue;
use Illuminate\Database\Seeder;

class VenueSeeder extends Seeder
{
    public function run(): void
    {
        Venue::create(['name' => 'Central Stadium']);
        Venue::create(['name' => 'North Arena']);
        Venue::create(['name' => 'South Park Sports Complex']);
        Venue::create(['name' => 'City Basketball Hall']);
        Venue::create(['name' => 'Olympic Venue']);
    }
}