<?php

namespace Database\Factories;

use App\Enums\ActiveStatus;
use App\Enums\SportsType;
use App\Models\Season;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sport>
 */
class SportFactory extends Factory
{
    public function definition(): array
    {
        $type = $this->faker->randomElement(SportsType::cases());

        return [
            'season_id' => Season::factory(),
            'name' => $type->value,
            'category' => $type->category(),
            'max_players_per_team' => $this->faker->numberBetween(2, 15),
            'status' => ActiveStatus::ACTIVE->value,
        ];
    }
}
