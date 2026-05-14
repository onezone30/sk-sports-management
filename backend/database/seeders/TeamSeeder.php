<?php

namespace Database\Seeders;

use App\Models\Division;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
        $handler = User::whereHas('role', fn($q) => $q->where('name', 'Coach'))->first();
        $divisions = Division::all();

        $teamNames = ['Eagles', 'Lions', 'Tigers', 'Bears', 'Wolves', 'Hawks', 'Panthers', 'Falcons'];
        $idx = 0;

        foreach ($divisions as $division) {
            for ($j = 1; $j <= 2; $j++) {
                $name = $teamNames[$idx % count($teamNames)] . ' ' . $division->name;
                Team::create([
                    'handler_id' => $handler->id,
                    'division_id' => $division->id,
                    'name' => $name,
                    'slug' => Str::slug($name . '-' . ($idx + 1)),
                    'description' => $division->name . ' division team',
                ]);
                $idx++;
            }
        }
    }
}
