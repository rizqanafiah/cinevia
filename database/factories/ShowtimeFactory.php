<?php

namespace Database\Factories;

use App\Models\Showtime;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Showtime>
 */
class ShowtimeFactory extends Factory
{
    protected $model = Showtime::class;

    public function definition(): array
    {
        return [
            'movie_id' => 1,
            'studio_id' => 1,
            'show_date' => now()->format('Y-m-d'),
            'start_time' => '19:00:00',
            'ticket_price' => 50000,
        ];
    }
}
