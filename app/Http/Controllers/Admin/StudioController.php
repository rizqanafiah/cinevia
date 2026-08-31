<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreStudioRequest;
use App\Http\Resources\StudioResource;
use App\Models\Seat;
use App\Models\Studio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudioController extends Controller
{
    /**
     * Tampilkan daftar studio.
     */
    public function index(Request $request)
    {
        $daftarStudio = Studio::withCount('seats')
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('Admin/Studios/Index', [
            'studios' => StudioResource::collection($daftarStudio),
        ]);
    }

    /**
     * Simpan studio baru dan otomatis buat kursi berdasarkan kapasitas standar.
     */
    public function store(StoreStudioRequest $request)
    {
        try {
            $dataValid = $request->validated();

            $studioBaru = Studio::create($dataValid);

            // Generate kursi otomatis (misal baris A-E, 10 kursi per baris sesuai kapasitas)
            $kapasitas = (int) $dataValid['capacity'];
            $kursiPerBaris = 10;
            $jumlahBaris = (int) ceil($kapasitas / $kursiPerBaris);
            $hurufBaris = range('A', 'Z');

            $totalDibuat = 0;
            for ($b = 0; $b < $jumlahBaris; $b++) {
                $baris = $hurufBaris[$b] ?? "R{$b}";
                for ($k = 1; $k <= $kursiPerBaris; $k++) {
                    if ($totalDibuat >= $kapasitas) {
                        break;
                    }
                    Seat::create([
                        'studio_id' => $studioBaru->id,
                        'seat_label' => "{$baris}{$k}",
                    ]);
                    $totalDibuat++;
                }
            }

            return back()->with('sukses', "Studio {$studioBaru->name} dan {$totalDibuat} kursi berhasil dibuat.");
        } catch (\Throwable $e) {
            return back()->with('error', 'Gagal menambahkan studio. Silakan coba lagi.');
        }
    }

    /**
     * Update data studio.
     */
    public function update(StoreStudioRequest $request, Studio $studio)
    {
        try {
            $studio->update($request->validated());

            return back()->with('sukses', 'Data studio berhasil diperbarui.');
        } catch (\Throwable $e) {
            return back()->with('error', 'Gagal memperbarui studio. Silakan coba lagi.');
        }
    }

    /**
     * Hapus studio beserta kursinya.
     */
    public function destroy(Studio $studio)
    {
        try {
            $studio->delete();

            return back()->with('sukses', 'Studio berhasil dihapus.');
        } catch (\Throwable $e) {
            return back()->with('error', 'Gagal menghapus studio. Silakan coba lagi.');
        }
    }
}
