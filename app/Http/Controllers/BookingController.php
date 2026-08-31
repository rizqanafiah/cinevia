<?php

namespace App\Http\Controllers;

use App\Enums\StatusBooking;
use App\Enums\StatusPembayaran;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\BookingSeat;
use App\Models\Payment;
use App\Models\Showtime;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Daftar booking milik customer yang login.
     */
    public function index()
    {
        $userLogin = auth()->user();

        $daftarBooking = Booking::with(['showtime.movie', 'showtime.studio', 'bookingSeats.seat', 'payment'])
            ->where('user_id', $userLogin->id)
            ->latest()
            ->paginate(10);

        return Inertia::render('Customer/Booking/Index', [
            'bookings' => BookingResource::collection($daftarBooking),
        ]);
    }

    /**
     * Buat booking tiket bioskop baru.
     */
    public function store(StoreBookingRequest $request)
    {
        $dataValid = $request->validated();
        $userLogin = auth()->user();
        $jadwalTayang = Showtime::with('studio')->findOrFail($dataValid['showtime_id']);

        $kursiDipilih = $dataValid['seat_ids'];
        $jumlahKursi = count($kursiDipilih);
        $totalHarga = $jadwalTayang->ticket_price * $jumlahKursi;

        // Cek apakah ada kursi yang bentrok / sudah terbooking
        $kursiTerbooking = BookingSeat::whereHas('booking', function ($query) use ($jadwalTayang) {
            $query->where('showtime_id', $jadwalTayang->id)
                  ->whereNotIn('status', ['CANCELLED']);
        })->whereIn('seat_id', $kursiDipilih)->pluck('seat_id')->toArray();

        if (! empty($kursiTerbooking)) {
            return back()->withErrors([
                'seat_ids' => 'Beberapa kursi yang Anda pilih sudah dipesan oleh orang lain. Silakan pilih kursi lain.',
            ]);
        }

        $bookingBaru = DB::transaction(function () use ($userLogin, $jadwalTayang, $kursiDipilih, $totalHarga) {
            // Buat record booking
            $booking = Booking::create([
                'user_id' => $userLogin->id,
                'showtime_id' => $jadwalTayang->id,
                'status' => StatusBooking::MENUNGGU,
                'total_price' => $totalHarga,
                'expired_at' => now()->addMinutes(30),
            ]);

            // Assign kursi ke booking
            foreach ($kursiDipilih as $seatId) {
                BookingSeat::create([
                    'booking_id' => $booking->id,
                    'seat_id' => $seatId,
                ]);
            }

            // Buat record payment
            Payment::create([
                'booking_id' => $booking->id,
                'amount' => $totalHarga,
                'status' => StatusPembayaran::BELUM_BAYAR,
            ]);

            return $booking;
        });

        return redirect()->route('bookings.show', $bookingBaru)
            ->with('sukses', 'Booking berhasil dibuat! Silakan unggah bukti pembayaran dalam 30 menit.');
    }

    /**
     * Detail booking dan instruksi pembayaran.
     */
    public function show(Booking $booking)
    {
        Gate::authorize('view', $booking);

        $booking->load([
            'showtime.movie',
            'showtime.studio',
            'bookingSeats.seat',
            'payment',
            'user',
        ]);

        return Inertia::render('Customer/Booking/Show', [
            'booking' => new BookingResource($booking),
        ]);
    }

    /**
     * Batalkan booking secara manual oleh customer.
     */
    public function cancel(Booking $booking)
    {
        Gate::authorize('cancel', $booking);

        $berhasilBatal = $booking->batalkan();

        if (! $berhasilBatal) {
            return back()->withErrors([
                'status' => 'Booking tidak dapat dibatalkan pada status saat ini.',
            ]);
        }

        return back()->with('sukses', 'Booking berhasil dibatalkan.');
    }
}
