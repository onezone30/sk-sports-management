<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('name', 'Admin')->first();
        $coachRole = Role::where('name', 'Coach')->first();
        $playerRole = Role::where('name', 'Player')->first();

        // Admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@sports.com',
            'password' => Hash::make('password'),
            'role_id' => $adminRole->id,
            'email_verified_at' => now(),
        ]);

        // Coach users
        User::create([
            'name' => 'John Coach',
            'email' => 'coach1@sports.com',
            'password' => Hash::make('password'),
            'role_id' => $coachRole->id,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Jane Coach',
            'email' => 'coach2@sports.com',
            'password' => Hash::make('password'),
            'role_id' => $coachRole->id,
            'email_verified_at' => now(),
        ]);

        // Player users
        User::factory(5)->create([
            'role_id' => $playerRole->id,
        ]);
    }
}