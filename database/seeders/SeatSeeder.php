<?php

namespace Database\Seeders;

use App\Models\Seat;
use App\Models\Studio;
use Illuminate\Database\Seeder;

class SeatSeeder extends Seeder
{
    public function run(): void
    {
        $studios = Studio::all();
        $hurufBaris = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

        foreach ($studios as $studio) {
            $kapasitas = $studio->capacity;
            $kursiPerBaris = 10;
            $jumlahBaris = (int) ceil($kapasitas / $kursiPerBaris);

            $totalDibuat = 0;
            for ($b = 0; $b < $jumlahBaris; $b++) {
                $baris = $hurufBaris[$b] ?? "R{$b}";
                for ($k = 1; $k <= $kursiPerBaris; $k++) {
                    if ($totalDibuat >= $kapasitas) {
                        break;
                    }
                    Seat::firstOrCreate([
                        'studio_id' => $studio->id,
                        'seat_label' => "{$baris}{$k}",
                    ]);
                    $totalDibuat++;
                }
            }
        }
    }
}
