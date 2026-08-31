<?php

use App\Http\Controllers\Admin\MovieController as AdminMovieController;
use App\Http\Controllers\Admin\SeatController as AdminSeatController;
use App\Http\Controllers\Admin\ShowtimeController as AdminShowtimeController;
use App\Http\Controllers\Admin\StudioController as AdminStudioController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\MovieSearchController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SalesReportController;
use App\Http\Controllers\Staff\PaymentVerificationController;
use App\Http\Controllers\TicketController;
use App\Http\Resources\MovieResource;
use App\Models\Movie;
use App\Models\Studio;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes (Guest & Authenticated)
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    $hariIni = now()->format('Y-m-d');

    // Ambil film yang sedang tayang (memiliki jadwal tayang)
    $filmTayang = Movie::with(['showtimes' => function ($query) use ($hariIni) {
        $query->whereDate('show_date', '>=', $hariIni)
              ->with('studio')
              ->orderBy('show_date')
              ->orderBy('start_time');
    }])->latest()->get();

    $daftarStudio = Studio::withCount('seats')->get();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'movies' => MovieResource::collection($filmTayang),
        'studios' => $daftarStudio,
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

// Katalog Film & Jadwal Publik
Route::get('/movies', [MovieSearchController::class, 'index'])->name('movies.index');
Route::get('/movies/{movie}', [MovieSearchController::class, 'show'])->name('movies.show');
Route::get('/showtimes/{showtime}/seats', [MovieSearchController::class, 'selectSeat'])->name('showtimes.seats');

/*
|--------------------------------------------------------------------------
| Authenticated User Routes (Umum)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();

        if ($user->hasRole('staff')) {
            $totalBooking = \App\Models\Booking::count();
            $bookingAktif = \App\Models\Booking::whereIn('status', [
                \App\Enums\StatusBooking::MENUNGGU,
                \App\Enums\StatusBooking::DIKONFIRMASI,
            ])->count();

            $stats = [
                'totalBooking' => $totalBooking,
                'bookingAktif' => $bookingAktif,
                'totalFilm' => \App\Models\Movie::count(),
                'totalStudio' => \App\Models\Studio::count(),
                'pembayaranPending' => \App\Models\Payment::where('status', \App\Enums\StatusPembayaran::MENUNGGU_VERIFIKASI)->count(),
            ];
        } elseif ($user->hasRole('admin')) {
            $stats = [
                'totalBooking' => \App\Models\Booking::count(),
                'bookingAktif' => \App\Models\Booking::whereIn('status', [
                    \App\Enums\StatusBooking::MENUNGGU,
                    \App\Enums\StatusBooking::DIKONFIRMASI,
                ])->count(),
                'totalFilm' => \App\Models\Movie::count(),
                'totalStudio' => \App\Models\Studio::count(),
                'pembayaranPending' => \App\Models\Payment::where('status', \App\Enums\StatusPembayaran::MENUNGGU_VERIFIKASI)->count(),
            ];
        } else {
            $totalBooking = \App\Models\Booking::where('user_id', $user->id)->count();
            $bookingAktif = \App\Models\Booking::where('user_id', $user->id)
                ->whereIn('status', [\App\Enums\StatusBooking::MENUNGGU, \App\Enums\StatusBooking::DIKONFIRMASI])
                ->count();

            $stats = [
                'totalBooking' => $totalBooking,
                'bookingAktif' => $bookingAktif,
                'totalFilm' => \App\Models\Movie::count(),
                'totalStudio' => \App\Models\Studio::count(),
                'pembayaranPending' => \App\Models\Payment::where('status', \App\Enums\StatusPembayaran::MENUNGGU_VERIFIKASI)->count(),
            ];
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
        ]);
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Akses streaming bukti pembayaran (diproteksi Policy di dalam controller)
    Route::get('/payments/{payment}/bukti', [PaymentController::class, 'showBukti'])->name('payments.bukti');
});

/*
|--------------------------------------------------------------------------
| Customer Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:customer'])->group(function () {
    Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
    Route::get('/bookings/{booking}', [BookingController::class, 'show'])->name('bookings.show');
    Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');

    // Upload Bukti Pembayaran
    Route::post('/payments/{booking}/upload', [PaymentController::class, 'upload'])->name('payments.upload');

    // E-Ticket
    Route::get('/tickets/{booking}', [TicketController::class, 'show'])->name('tickets.show');
    Route::get('/tickets/{booking}/download', [TicketController::class, 'download'])->name('tickets.download');
});

/*
|--------------------------------------------------------------------------
| Staff & Admin Shared Routes (Verifikasi Pembayaran)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:staff,admin'])->group(function () {
    Route::get('/staff/payments', [PaymentVerificationController::class, 'index'])->name('staff.payments.index');
    Route::post('/staff/payments/{payment}/verify', [PaymentController::class, 'verify'])->name('staff.payments.verify');

    Route::get('/staff/reports', [SalesReportController::class, 'index'])->name('staff.reports.index');
    Route::get('/staff/reports/download', [SalesReportController::class, 'download'])->name('staff.reports.download');
});

/*
|--------------------------------------------------------------------------
| Admin Routes (Master Data & User Management)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // User Management
    Route::resource('users', AdminUserController::class)->except(['create', 'show', 'edit']);

    // Movies Management
    Route::resource('movies', AdminMovieController::class)->except(['create', 'show', 'edit']);

    // Studios Management
    Route::resource('studios', AdminStudioController::class)->except(['create', 'show', 'edit']);

    // Seats Management
    Route::resource('seats', AdminSeatController::class)->except(['create', 'show', 'edit']);

    // Showtimes Management
    Route::resource('showtimes', AdminShowtimeController::class)->except(['create', 'show', 'edit']);
});

require __DIR__.'/auth.php';
