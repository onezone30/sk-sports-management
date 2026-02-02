<?php

namespace Database\Factories;

use App\Enums\ActiveStatus;
use App\Models\Season;
use App\Models\Team;
use App\Models\Venue;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Game>
 */
class GameFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'season_id' => Season::factory(),
            'home_team_id' => Team::factory(),
            'away_team_id' => Team::factory(),
            'venue_id' => Venue::factory(),
            'home_score' => $this->faker->numberBetween(0, 5),
            'away_score' => $this->faker->numberBetween(0, 5),
            'status' => ActiveStatus::ACTIVE->value,
            'scheduled_at' => $this->faker->dateTimeBetween('now', '+3 months'),
        ];
    }
}
