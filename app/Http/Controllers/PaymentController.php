<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadPaymentProofRequest;
use App\Http\Requests\VerifyPaymentRequest;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class PaymentController extends Controller
{
    /**
     * Upload bukti pembayaran (Customer).
     */
    public function upload(UploadPaymentProofRequest $request, Booking $booking)
    {
        $pembayaran = $booking->payment;

        Gate::authorize('uploadBukti', $pembayaran);

        // Simpan file di disk local privat (storage/app/private/bukti-pembayaran/)
        $pathBukti = Storage::disk('local')->putFile('bukti-pembayaran', $request->file('bukti_pembayaran'));

        $berhasilUpload = $pembayaran->uploadBukti($pathBukti);

        if (! $berhasilUpload) {
            return back()->withErrors([
                'bukti_pembayaran' => 'Bukti pembayaran tidak dapat diunggah pada status saat ini.',
            ]);
        }

        return back()->with('sukses', 'Bukti pembayaran berhasil diunggah. Menunggu verifikasi staff bioskop.');
    }

    /**
     * Stream file bukti pembayaran (protected oleh policy).
     */
    public function showBukti(Payment $payment)
    {
        Gate::authorize('viewBukti', $payment);

        if (empty($payment->proof_path) || ! Storage::disk('local')->exists($payment->proof_path)) {
            abort(404, 'Bukti pembayaran tidak ditemukan.');
        }

        return Storage::disk('local')->response($payment->proof_path);
    }

    /**
     * Verifikasi atau tolak pembayaran (Staff/Admin).
     */
    public function verify(VerifyPaymentRequest $request, Payment $payment)
    {
        Gate::authorize('verify', $payment);

        $aksi = $request->validated()['aksi'];
        $verifierId = auth()->id();

        if ($aksi === 'verifikasi') {
            $hasilVerifikasi = $payment->verifikasi($verifierId);
            $pesan = $hasilVerifikasi
                ? 'Pembayaran berhasil diverifikasi dan e-ticket telah diterbitkan.'
                : 'Pembayaran tidak dapat diverifikasi pada status saat ini.';
        } else {
            $hasilVerifikasi = $payment->tolak($verifierId);
            $pesan = $hasilVerifikasi
                ? 'Pembayaran ditolak. Customer dapat mengunggah bukti ulang.'
                : 'Pembayaran tidak dapat ditolak pada status saat ini.';
        }

        if (! $hasilVerifikasi) {
            return back()->withErrors(['aksi' => $pesan]);
        }

        return back()->with('sukses', $pesan);
    }
}
