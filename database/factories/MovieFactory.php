<?php

namespace Database\Factories;

use App\Models\Movie;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Movie>
 */
class MovieFactory extends Factory
{
    protected $model = Movie::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'genre' => 'Action/Adventure',
            'duration_minutes' => 120,
            'synopsis' => fake()->paragraph(),
            'poster_path' => 'https://images.unsplash.com/photo-1534447677768-be436bb09401',
            'age_rating' => '13+',
        ];
    }
}
