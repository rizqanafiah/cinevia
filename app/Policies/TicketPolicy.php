<?php

namespace App\Policies;

use App\Enums\StatusBooking;
use App\Models\Booking;
use App\Models\User;

class TicketPolicy
{
    /**
     * Lihat e-ticket: hanya jika booking berstatus CONFIRMED dan milik user/staff.
     */
    public function view(User $user, Booking $booking): bool
    {
        if ($booking->status !== StatusBooking::DIKONFIRMASI) {
            return false;
        }

        if ($user->hasAnyRole(['admin', 'staff'])) {
            return true;
        }

        return $booking->user_id === $user->id;
    }

    /**
     * Download PDF e-ticket: hanya jika booking CONFIRMED.
     */
    public function download(User $user, Booking $booking): bool
    {
        return $this->view($user, $booking);
    }
}
