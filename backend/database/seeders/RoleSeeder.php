<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::create([
            'name' => 'Admin',
            'description' => 'System administrator with full access',
            'status' => 'active',
        ]);

        Role::create([
            'name' => 'Coach',
            'description' => 'Team coach',
            'status' => 'active',
        ]);

        Role::create([
            'name' => 'Manager',
            'description' => 'League or team manager',
            'status' => 'active',
        ]);

        Role::create([
            'name' => 'Player',
            'description' => 'Team player',
            'status' => 'active',
        ]);

        Role::create([
            'name' => 'Spectator',
            'description' => 'Regular user',
            'status' => 'active',
        ]);
    }
}