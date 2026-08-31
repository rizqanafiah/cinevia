<?php

namespace App\Console\Commands;

use App\Enums\StatusBooking;
use App\Models\Booking;
use Illuminate\Console\Command;

class CancelExpiredBookings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bookings:cancel-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Batalkan booking tiket bioskop yang telah melewati batas waktu pembayaran (30 menit)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $daftarBookingKedaluwarsa = Booking::where('status', StatusBooking::MENUNGGU)
            ->whereNotNull('expired_at')
            ->where('expired_at', '<', now())
            ->get();

        $jumlahDibatalkan = 0;
        foreach ($daftarBookingKedaluwarsa as $booking) {
            $booking->batalkan();
            $jumlahDibatalkan++;
        }

        $this->info("Berhasil membatalkan {$jumlahDibatalkan} booking yang kedaluwarsa.");

        return Command::SUCCESS;
    }
}
