<?php

namespace Database\Factories;

use App\Enums\Gender;
use App\Enums\Status;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Player>
 */
class PlayerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Generate gender first so first_name matches it, instead of pairing
        // a random gender with a name that reads as the opposite.
        $gender = $this->faker->randomElement(Gender::cases());

        return [
            'first_name' => $gender === Gender::MALE
                ? $this->faker->firstNameMale()
                : $this->faker->firstNameFemale(),
            'middle_name' => $this->faker->optional(0.7)->lastName(),
            'last_name' => $this->faker->lastName(),
            'suffix' => $this->faker->optional(0.1)->randomElement(['Jr.', 'Sr.', 'III']),
            'date_of_birth' => $this->faker->unique()->dateTimeBetween('-40 years', '-15 years'),
            'gender' => $gender->value,
            'email' => $this->faker->optional(0.6)->safeEmail(),
            'phone' => $this->faker->optional(0.6)->phoneNumber(),
            'emergency_contact_name' => $this->faker->optional(0.5)->name(),
            'emergency_contact_phone' => $this->faker->optional(0.5)->phoneNumber(),
            'status' => Status::ACTIVE->value,
        ];
    }
}
