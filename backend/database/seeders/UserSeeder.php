<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // firstOrFail() (not first()) so a renamed/missing role in RoleSeeder
        // fails loudly here instead of a null-property fatal a few lines down.
        $adminRole = Role::where('name', 'Admin')->firstOrFail();
        $coachRole = Role::where('name', 'Coach')->firstOrFail();
        $playerRole = Role::where('name', 'Player')->firstOrFail();

        // Password hashing is handled by the `hashed` cast on User::casts().
        // Admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@admin.com',
            'password' => 'admin',
            'role_id' => $adminRole->id,
            'email_verified_at' => now(),
        ]);

        // Coach users
        User::create([
            'name' => 'John Coach',
            'email' => 'coach1@sports.com',
            'password' => 'password',
            'role_id' => $coachRole->id,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Jane Coach',
            'email' => 'coach2@sports.com',
            'password' => 'password',
            'role_id' => $coachRole->id,
            'email_verified_at' => now(),
        ]);

        // Player users
        User::factory(5)->create([
            'role_id' => $playerRole->id,
        ]);
    }
}
