<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSeatRequest;
use App\Http\Resources\SeatResource;
use App\Http\Resources\StudioResource;
use App\Models\Seat;
use App\Models\Studio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SeatController extends Controller
{
    /**
     * Tampilkan daftar kursi studio.
     */
    public function index(Request $request)
    {
        $studioId = $request->query('studio_id');

        $daftarStudio = Studio::orderBy('name')->get();
        $studioTerpilih = $studioId ? Studio::find($studioId) : $daftarStudio->first();

        $daftarKursi = Seat::when($studioTerpilih, function ($query) use ($studioTerpilih) {
            $query->where('studio_id', $studioTerpilih->id);
        })
        ->orderBy('seat_label')
        ->get();

        return Inertia::render('Admin/Seats/Index', [
            'seats' => SeatResource::collection($daftarKursi),
            'studios' => StudioResource::collection($daftarStudio),
            'selectedStudio' => $studioTerpilih ? new StudioResource($studioTerpilih) : null,
        ]);
    }

    /**
     * Tambah kursi tunggal ke studio.
     */
    public function store(StoreSeatRequest $request)
    {
        $dataValid = $request->validated();

        $sudahAda = Seat::where('studio_id', $dataValid['studio_id'])
            ->where('seat_label', $dataValid['seat_label'])
            ->exists();

        if ($sudahAda) {
            return back()->withErrors(['seat_label' => 'Label kursi sudah ada di studio ini.']);
        }

        Seat::create($dataValid);

        return back()->with('sukses', 'Kursi berhasil ditambahkan.');
    }

    /**
     * Hapus kursi.
     */
    public function destroy(Seat $seat)
    {
        $seat->delete();

        return back()->with('sukses', 'Kursi berhasil dihapus.');
    }
}
