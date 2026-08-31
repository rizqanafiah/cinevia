<?php

namespace App\Policies;

use App\Enums\StatusBooking;
use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    /**
     * Apakah user boleh melihat booking ini.
     */
    public function view(User $user, Booking $booking): bool
    {
        // Admin & Staff bisa melihat semua booking, customer hanya miliknya
        if ($user->hasAnyRole(['admin', 'staff'])) {
            return true;
        }

        return $booking->user_id === $user->id;
    }

    /**
     * Apakah user boleh membatalkan booking.
     */
    public function cancel(User $user, Booking $booking): bool
    {
        // Customer hanya boleh batalkan booking miliknya yang masih berstatus MENUNGGU (PENDING)
        return $booking->user_id === $user->id && $booking->status === StatusBooking::MENUNGGU;
    }

    /**
     * Download / lihat e-ticket (hanya saat status CONFIRMED).
     */
    public function download(User $user, Booking $booking): bool
    {
        if ($booking->status !== StatusBooking::DIKONFIRMASI) {
            return false;
        }

        if ($user->hasAnyRole(['admin', 'staff'])) {
            return true;
        }

        return $booking->user_id === $user->id;
    }
}
