<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreShowtimeRequest;
use App\Http\Resources\MovieResource;
use App\Http\Resources\ShowtimeResource;
use App\Http\Resources\StudioResource;
use App\Models\Movie;
use App\Models\Showtime;
use App\Models\Studio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShowtimeController extends Controller
{
    /**
     * Tampilkan daftar jadwal tayang.
     */
    public function index(Request $request)
    {
        $filterTanggal = $request->query('date', now()->format('Y-m-d'));
        $filterFilm = $request->query('movie_id');

        $daftarJadwal = Showtime::with(['movie', 'studio'])
            ->when($filterTanggal, function ($query, $tgl) {
                $query->whereDate('show_date', $tgl);
            })
            ->when($filterFilm, function ($query, $filmId) {
                $query->where('movie_id', $filmId);
            })
            ->orderBy('show_date')
            ->orderBy('start_time')
            ->paginate(15)
            ->withQueryString();

        $daftarFilm = Movie::orderBy('title')->get();
        $daftarStudio = Studio::orderBy('name')->get();

        return Inertia::render('Admin/Showtimes/Index', [
            'showtimes' => ShowtimeResource::collection($daftarJadwal),
            'movies' => MovieResource::collection($daftarFilm),
            'studios' => StudioResource::collection($daftarStudio),
            'filters' => [
                'date' => $filterTanggal,
                'movie_id' => $filterFilm,
            ],
        ]);
    }

    /**
     * Simpan jadwal tayang baru.
     */
    public function store(StoreShowtimeRequest $request)
    {
        try {
            Showtime::create($request->validated());

            return back()->with('sukses', 'Jadwal tayang berhasil ditambahkan.');
        } catch (\Throwable $e) {
            return back()->with('error', 'Gagal menambahkan jadwal tayang. Silakan coba lagi.');
        }
    }

    /**
     * Update jadwal tayang.
     */
    public function update(StoreShowtimeRequest $request, Showtime $showtime)
    {
        try {
            $showtime->update($request->validated());

            return back()->with('sukses', 'Jadwal tayang berhasil diperbarui.');
        } catch (\Throwable $e) {
            return back()->with('error', 'Gagal memperbarui jadwal tayang. Silakan coba lagi.');
        }
    }

    /**
     * Hapus jadwal tayang.
     */
    public function destroy(Showtime $showtime)
    {
        try {
            $showtime->delete();

            return back()->with('sukses', 'Jadwal tayang berhasil dihapus.');
        } catch (\Throwable $e) {
            return back()->with('error', 'Gagal menghapus jadwal tayang. Silakan coba lagi.');
        }
    }
}
