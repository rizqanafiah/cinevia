<?php

namespace Database\Factories;

use App\Models\Studio;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Studio>
 */
class StudioFactory extends Factory
{
    protected $model = Studio::class;

    public function definition(): array
    {
        return [
            'name' => 'Studio ' . fake()->randomElement(['A', 'B', 'C', 'D']),
            'capacity' => 30,
        ];
    }
}
