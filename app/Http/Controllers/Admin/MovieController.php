<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMovieRequest;
use App\Http\Requests\Admin\UpdateMovieRequest;
use App\Http\Resources\MovieResource;
use App\Models\Movie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MovieController extends Controller
{
    /**
     * Tampilkan daftar film untuk admin.
     */
    public function index(Request $request)
    {
        $kataKunci = $request->query('search');

        $daftarFilm = Movie::when($kataKunci, function ($query, $cari) {
            $query->where('title', 'like', "%{$cari}%")
                  ->orWhere('genre', 'like', "%{$cari}%");
        })
        ->latest()
        ->paginate(10)
        ->withQueryString();

        return Inertia::render('Admin/Movies/Index', [
            'movies' => MovieResource::collection($daftarFilm),
            'filters' => ['search' => $kataKunci],
        ]);
    }

    /**
     * Simpan film baru.
     */
    public function store(StoreMovieRequest $request)
    {
        try {
            $dataValid = $request->validated();

            if ($request->hasFile('poster')) {
                $pathPoster = $request->file('poster')->store('posters', 'public');
                $dataValid['poster_path'] = '/storage/' . $pathPoster;
            }

            Movie::create($dataValid);

            return back()->with('sukses', 'Film baru berhasil ditambahkan.');
        } catch (\Throwable $e) {
            return back()->with('error', 'Gagal menambahkan film. Silakan coba lagi.');
        }
    }

    /**
     * Update data film.
     */
    public function update(UpdateMovieRequest $request, Movie $movie)
    {
        try {
            $dataValid = $request->validated();

            if ($request->hasFile('poster')) {
                // Hapus poster lama jika ada di storage public
                if ($movie->poster_path && str_starts_with($movie->poster_path, '/storage/posters/')) {
                    $fileLama = str_replace('/storage/', '', $movie->poster_path);
                    Storage::disk('public')->delete($fileLama);
                }
                $pathPoster = $request->file('poster')->store('posters', 'public');
                $dataValid['poster_path'] = '/storage/' . $pathPoster;
            }

            $movie->update($dataValid);

            return back()->with('sukses', 'Data film berhasil diperbarui.');
        } catch (\Throwable $e) {
            return back()->with('error', 'Gagal memperbarui film. Silakan coba lagi.');
        }
    }

    /**
     * Hapus film.
     */
    public function destroy(Movie $movie)
    {
        try {
            if ($movie->poster_path && str_starts_with($movie->poster_path, '/storage/posters/')) {
                $fileLama = str_replace('/storage/', '', $movie->poster_path);
                Storage::disk('public')->delete($fileLama);
            }

            $movie->delete();

            return back()->with('sukses', 'Film berhasil dihapus.');
        } catch (\Throwable $e) {
            return back()->with('error', 'Gagal menghapus film. Silakan coba lagi.');
        }
    }
}
