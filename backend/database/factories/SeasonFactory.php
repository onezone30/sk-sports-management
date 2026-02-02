<?php

namespace Database\Factories;

use App\Enums\ActiveStatus;
use App\Models\Sport;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Season>
 */
class SeasonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'sport_id' => Sport::factory(),
            'handler_id' => User::factory(),
            'name' => $this->faker->word() . ' Season',
            'year' => $this->faker->year(),
            'start_date' => $this->faker->dateTimeBetween('now', '+6 months'),
            'end_date' => $this->faker->dateTimeBetween('+6 months', '+12 months'),
            'status' => ActiveStatus::ACTIVE->value,
        ];
    }
}
