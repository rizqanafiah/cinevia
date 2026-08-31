<?php

namespace App\Http\Controllers;

use App\Http\Resources\MovieResource;
use App\Http\Resources\ShowtimeResource;
use App\Models\BookingSeat;
use App\Models\Movie;
use App\Models\Showtime;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MovieSearchController extends Controller
{
    /**
     * Tampilkan katalog film & jadwal tayang publik.
     */
    public function index(Request $request)
    {
        $kataKunci = $request->query('search');
        $genreTerpilih = $request->query('genre');
        $tanggalPilihan = $request->query('date', now()->format('Y-m-d'));

        $daftarFilm = Movie::with(['showtimes' => function ($query) use ($tanggalPilihan) {
            $query->whereDate('show_date', $tanggalPilihan)
                  ->with('studio')
                  ->orderBy('start_time');
        }])
        ->when($kataKunci, function ($query, $cari) {
            $query->where('title', 'like', "%{$cari}%");
        })
        ->when($genreTerpilih, function ($query, $genre) {
            $query->where('genre', $genre);
        })
        ->latest()
        ->get();

        $daftarGenre = Movie::select('genre')->distinct()->pluck('genre');

        return Inertia::render('Public/MovieIndex', [
            'movies' => MovieResource::collection($daftarFilm),
            'genres' => $daftarGenre,
            'filters' => [
                'search' => $kataKunci,
                'genre' => $genreTerpilih,
                'date' => $tanggalPilihan,
            ],
        ]);
    }

    /**
     * Tampilkan detail film beserta jadwal tayang & studio.
     */
    public function show(Movie $movie, Request $request)
    {
        $tanggalPilihan = $request->query('date', now()->format('Y-m-d'));

        $movie->load(['showtimes' => function ($query) use ($tanggalPilihan) {
            $query->whereDate('show_date', $tanggalPilihan)
                  ->with('studio')
                  ->orderBy('start_time');
        }]);

        return Inertia::render('Public/MovieDetail', [
            'movie' => new MovieResource($movie),
            'selectedDate' => $tanggalPilihan,
        ]);
    }

    /**
     * Tampilkan detail showtime dan denah kursi studio dengan status ketersediaan.
     */
    public function selectSeat(Showtime $showtime)
    {
        $showtime->load(['movie', 'studio.seats']);

        // Kumpulkan ID kursi yang sudah dibooking pada showtime ini
        $kursiTerbooking = BookingSeat::whereHas('booking', function ($query) use ($showtime) {
            $query->where('showtime_id', $showtime->id)
                  ->whereNotIn('status', ['CANCELLED']);
        })->pluck('seat_id')->toArray();

        // Format denah kursi
        $daftarKursi = $showtime->studio->seats->map(function ($kursi) use ($kursiTerbooking) {
            return [
                'id' => $kursi->id,
                'seat_label' => $kursi->seat_label,
                'tersedia' => ! in_array($kursi->id, $kursiTerbooking),
            ];
        });

        return Inertia::render('Public/SeatSelection', [
            'showtime' => new ShowtimeResource($showtime),
            'seats' => $daftarKursi,
        ]);
    }
}
