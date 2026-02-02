<?php

namespace Database\Factories;

use App\Enums\ActiveStatus;
use App\Models\Division;
use App\Models\Season;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Team>
 */
class TeamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->word();
        return [
            'handler_id' => User::factory(),
            'season_id' => Season::factory(),
            'division_id' => Division::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'street' => $this->faker->address(),
            'description' => $this->faker->sentence(),
            'status' => ActiveStatus::ACTIVE->value,
        ];
    }
}
