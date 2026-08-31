<?php

namespace App\Http\Controllers;

use App\Enums\StatusPembayaran;
use App\Models\Booking;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesReportController extends Controller
{
    /**
     * Tampilkan laporan penjualan untuk staff dan admin.
     */
    public function index(Request $request)
    {
        [$startDate, $endDate] = $this->resolveRange($request);

        $bookings = $this->baseQuery($startDate, $endDate)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'booking_code' => $booking->booking_code,
                    'customer_name' => $booking->user?->name ?? '-',
                    'movie_title' => $booking->showtime?->movie?->title ?? '-',
                    'studio_name' => $booking->showtime?->studio?->name ?? '-',
                    'show_date' => $booking->showtime?->show_date ? Carbon::parse($booking->showtime->show_date)->format('d-m-Y') : '-',
                    'seat_count' => $booking->bookingSeats?->count() ?? 0,
                    'total_price' => (int) ($booking->total_price ?? 0),
                    'verified_at' => $booking->payment?->verified_at ? $booking->payment->verified_at->format('d-m-Y H:i') : '-',
                ];
            });

        $totalRevenue = $bookings->sum('total_price');
        $totalTransactions = $bookings->count();

        return Inertia::render('Staff/Reports/Index', [
            'report' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'bookings' => $bookings,
                'total_revenue' => $totalRevenue,
                'total_transactions' => $totalTransactions,
                'average_ticket' => $totalTransactions > 0 ? round($totalRevenue / $totalTransactions, 0) : 0,
            ],
        ]);
    }

    /**
     * Unduh laporan penjualan dalam format PDF.
     */
    public function download(Request $request)
    {
        [$startDate, $endDate] = $this->resolveRange($request);

        $bookings = $this->baseQuery($startDate, $endDate)
            ->get()
            ->map(function ($booking) {
                return [
                    'booking_code' => $booking->booking_code,
                    'customer_name' => $booking->user?->name ?? '-',
                    'movie_title' => $booking->showtime?->movie?->title ?? '-',
                    'studio_name' => $booking->showtime?->studio?->name ?? '-',
                    'show_date' => $booking->showtime?->show_date ? Carbon::parse($booking->showtime->show_date)->translatedFormat('d F Y') : '-',
                    'seat_labels' => $booking->bookingSeats?->map(fn ($item) => $item->seat?->seat_label ?? '-')->implode(', ') ?? '-',
                    'total_price' => (int) ($booking->total_price ?? 0),
                    'verified_at' => $booking->payment?->verified_at ? $booking->payment->verified_at->translatedFormat('d F Y H:i') : '-',
                ];
            });

        $totalRevenue = $bookings->sum('total_price');

        $pdf = Pdf::loadView('pdf.sales-report', [
            'startDate' => $startDate,
            'endDate' => $endDate,
            'bookings' => $bookings,
            'totalRevenue' => $totalRevenue,
            'totalTransactions' => $bookings->count(),
        ]);

        $filename = 'Laporan-Penjualan-Cinevia-' . $startDate . '-sampai-' . $endDate . '.pdf';

        return $pdf->download($filename);
    }

    protected function resolveRange(Request $request): array
    {
        $startDate = $request->query('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->query('end_date', now()->format('Y-m-d'));

        return [
            $startDate,
            $endDate,
        ];
    }

    protected function baseQuery(string $startDate, string $endDate)
    {
        return Booking::with(['user', 'showtime.movie', 'showtime.studio', 'payment', 'bookingSeats.seat'])
            ->whereHas('payment', function ($query) use ($startDate, $endDate) {
                $query->where('status', StatusPembayaran::LUNAS)
                    ->whereBetween('verified_at', [
                        Carbon::parse($startDate)->startOfDay(),
                        Carbon::parse($endDate)->endOfDay(),
                    ]);
            })
            ->orderByDesc('created_at');
    }
}
