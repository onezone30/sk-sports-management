<?php

namespace Database\Seeders;

use App\Enums\Status;
use App\Models\Venue;
use Illuminate\Database\Seeder;

class VenueSeeder extends Seeder
{
    public function run(): void
    {
        Venue::create(['name' => 'Central Stadium', 'address_line' => '123 Main St', 'city' => 'Springfield', 'state' => 'IL', 'zip' => '62701', 'capacity' => 15000, 'status' => Status::ACTIVE]);
        Venue::create(['name' => 'North Arena', 'address_line' => '45 North Ave', 'city' => 'Springfield', 'state' => 'IL', 'zip' => '62702', 'capacity' => 8000, 'status' => Status::ACTIVE]);
        Venue::create(['name' => 'South Park Sports Complex', 'address_line' => '789 South Park Rd', 'city' => 'Springfield', 'state' => 'IL', 'zip' => '62703', 'capacity' => 5000, 'status' => Status::ACTIVE]);
        Venue::create(['name' => 'City Basketball Hall', 'address_line' => '10 Hall St', 'city' => 'Springfield', 'state' => 'IL', 'zip' => '62704', 'capacity' => 3000, 'status' => Status::ACTIVE]);
        Venue::create(['name' => 'Olympic Venue', 'address_line' => '1 Olympic Way', 'city' => 'Springfield', 'state' => 'IL', 'zip' => '62705', 'capacity' => 40000, 'status' => Status::ACTIVE]);
    }
}