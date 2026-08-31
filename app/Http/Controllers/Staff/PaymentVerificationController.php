<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentVerificationController extends Controller
{
    /**
     * Tampilkan antrean pembayaran untuk verifikasi staff.
     */
    public function index(Request $request)
    {
        $statusFilter = $request->query('status', 'WAITING_VERIFICATION');

        $daftarPembayaran = Payment::with(['booking.user', 'booking.showtime.movie', 'booking.showtime.studio', 'booking.bookingSeats.seat', 'verifier'])
            ->when($statusFilter, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Staff/PaymentVerification/Index', [
            'payments' => PaymentResource::collection($daftarPembayaran),
            'filters' => ['status' => $statusFilter],
        ]);
    }
}
