<?php

namespace Database\Seeders;

use App\Models\Movie;
use App\Models\Showtime;
use App\Models\Studio;
use Illuminate\Database\Seeder;

class ShowtimeSeeder extends Seeder
{
    public function run(): void
    {
        $movies = Movie::all();
        $studios = Studio::all();

        if ($movies->isEmpty() || $studios->isEmpty()) {
            return;
        }

        // Buat jadwal untuk 7 hari ke depan
        $jamTayang = ['12:30', '15:15', '18:00', '20:45'];
        $hargaPerStudio = [
            'Studio 1 (IMAX Laser)' => 65000,
            'Studio 2 (Dolby Atmos)' => 50000,
            'Studio 3 (Premiere Lounge)' => 85000,
        ];

        for ($hari = 0; $hari < 7; $hari++) {
            $tanggal = now()->addDays($hari)->format('Y-m-d');

            foreach ($studios as $idxStudio => $studio) {
                $film = $movies[$idxStudio % $movies->count()];
                $harga = $hargaPerStudio[$studio->name] ?? 50000;

                // Hari sabtu & minggu harga naik sedikit
                $isWeekend = in_array(date('N', strtotime($tanggal)), [6, 7]);
                $finalPrice = $isWeekend ? $harga + 10000 : $harga;

                foreach ($jamTayang as $jam) {
                    Showtime::firstOrCreate([
                        'movie_id' => $film->id,
                        'studio_id' => $studio->id,
                        'show_date' => $tanggal,
                        'start_time' => $jam,
                    ], [
                        'ticket_price' => $finalPrice,
                    ]);
                }
            }
        }
    }
}
