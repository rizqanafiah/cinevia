<?php

namespace Database\Seeders;

use App\Models\Studio;
use Illuminate\Database\Seeder;

class StudioSeeder extends Seeder
{
    public function run(): void
    {
        $daftarStudio = [
            ['name' => 'Studio 1 (IMAX Laser)', 'capacity' => 50],
            ['name' => 'Studio 2 (Dolby Atmos)', 'capacity' => 40],
            ['name' => 'Studio 3 (Premiere Lounge)', 'capacity' => 30],
        ];

        foreach ($daftarStudio as $studio) {
            Studio::firstOrCreate(
                ['name' => $studio['name']],
                ['capacity' => $studio['capacity']]
            );
        }
    }
}
