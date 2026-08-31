<?php

namespace Database\Seeders;

use App\Models\Movie;
use Illuminate\Database\Seeder;

class MovieSeeder extends Seeder
{
    public function run(): void
    {
        $daftarFilm = [
            [
                'title' => 'Interstellar Horizon',
                'genre' => 'Sci-Fi / Adventure',
                'duration_minutes' => 165,
                'synopsis' => 'Perjalanan spektakuler melintasi lubang cacing di luar angkasa untuk menemukan tempat tinggal baru bagi peradaban manusia yang di ambang kepunahan.',
                'poster_path' => 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
                'age_rating' => 'R13',
            ],
            [
                'title' => 'Cyber Dynasty: 2099',
                'genre' => 'Action / Cyberpunk',
                'duration_minutes' => 135,
                'synopsis' => 'Di era megakorporasi neo-metropolis, seorang detektif cybernetic mengungkap konspirasi AI rahasia yang mengontrol memori penduduk kota.',
                'poster_path' => 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
                'age_rating' => 'D17',
            ],
            [
                'title' => 'The Lost Melody of Venice',
                'genre' => 'Drama / Romance',
                'duration_minutes' => 118,
                'synopsis' => 'Kisah cinta dan pencarian partitur musik klasik yang hilang di gang-gang kanal Venesia yang romantis dan penuh misteri seni.',
                'poster_path' => 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
                'age_rating' => 'SU',
            ],
            [
                'title' => 'Shadow of The Colossus: Origins',
                'genre' => 'Fantasy / Action',
                'duration_minutes' => 142,
                'synopsis' => 'Seorang ksatria muda menjelajahi tanah terlarang untuk mengalahkan raksasa kuno demi menghidupkan kembali cinta sejatinya.',
                'poster_path' => 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
                'age_rating' => 'R13',
            ],
            [
                'title' => 'Midnight Haunting: Salem',
                'genre' => 'Horror / Mystery',
                'duration_minutes' => 105,
                'synopsis' => 'Sekelompok peneliti sejarah tanpa sengaja membangkitkan entitas supranatural dari abad ke-17 di sebuah mansion terkutuk.',
                'poster_path' => 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&q=80',
                'age_rating' => 'D17',
            ],
            [
                'title' => 'Little Panda & Magic Forest',
                'genre' => 'Animation / Family',
                'duration_minutes' => 95,
                'synopsis' => 'Petualangan animasi panda kecil yang lucu bersama sahabat-sahabatnya menyelamatkan hutan ajaib dari kekeringan abadi.',
                'poster_path' => 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
                'age_rating' => 'SU',
            ],
        ];

        foreach ($daftarFilm as $film) {
            Movie::firstOrCreate(
                ['title' => $film['title']],
                $film
            );
        }
    }
}
