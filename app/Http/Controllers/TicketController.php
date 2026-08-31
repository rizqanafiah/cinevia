<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookingResource;
use App\Models\Booking;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TicketController extends Controller
{
    /**
     * Lihat e-ticket di web browser.
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

        return Inertia::render('Customer/Ticket/Show', [
            'booking' => new BookingResource($booking),
        ]);
    }

    /**
     * Unduh e-ticket resmi format PDF dengan QR Code.
     */
    public function download(Booking $booking)
    {
        Gate::authorize('download', $booking);

        $booking->load([
            'showtime.movie',
            'showtime.studio',
            'bookingSeats.seat',
            'payment',
            'user',
        ]);

        // Generate QR Code base64 SVG
        $qrCodeSvg = base64_encode(QrCode::format('svg')->size(140)->errorCorrection('H')->generate($booking->booking_code));

        $pdf = Pdf::loadView('pdf.ticket', [
            'booking' => $booking,
            'qrCode' => $qrCodeSvg,
        ])->setPaper('a5', 'portrait');

        $namaFile = 'Cinevia-Ticket-' . $booking->booking_code . '.pdf';

        return $pdf->download($namaFile);
    }
}
