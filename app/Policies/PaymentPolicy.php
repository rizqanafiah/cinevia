<?php

namespace App\Policies;

use App\Enums\StatusPembayaran;
use App\Models\Payment;
use App\Models\User;

class PaymentPolicy
{
    /**
     * User yang berhak melihat pembayaran ini.
     */
    public function view(User $user, Payment $payment): bool
    {
        if ($user->hasAnyRole(['admin', 'staff'])) {
            return true;
        }

        return $payment->booking->user_id === $user->id;
    }

    /**
     * Customer mengunggah bukti pembayaran.
     */
    public function uploadBukti(User $user, Payment $payment): bool
    {
        if ($payment->booking->user_id !== $user->id) {
            return false;
        }

        // Boleh upload jika belum bayar atau jika ditolak sebelumnya (bisa re-upload)
        $statusSaatIni = $payment->status instanceof \BackedEnum ? $payment->status->value : (string) $payment->status;
        return in_array($statusSaatIni, [StatusPembayaran::BELUM_BAYAR->value, StatusPembayaran::DITOLAK->value], true);
    }

    /**
     * Stream file bukti pembayaran (hanya staff, admin, atau pemilik booking).
     */
    public function viewBukti(User $user, Payment $payment): bool
    {
        if ($user->hasAnyRole(['admin', 'staff'])) {
            return true;
        }

        return $payment->booking->user_id === $user->id;
    }

    /**
     * Verifikasi atau tolak bukti pembayaran (Staff & Admin).
     */
    public function verify(User $user, Payment $payment): bool
    {
        return $user->hasAnyRole(['admin', 'staff']);
    }
}
