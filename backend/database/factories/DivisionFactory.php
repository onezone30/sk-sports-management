<?php

namespace Database\Factories;

use App\Models\Sport;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Division>
 */
class DivisionFactory extends Factory
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
            'min_age' => $this->faker->numberBetween(10, 18),
            'max_age' => $this->faker->numberBetween(19, 40),
            'name' => $this->faker->unique()->word() . ' Division',
        ];
    }
}
