<?php

namespace App\Models;

use App\Enums\StatusPembayaran;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'amount',
        'proof_path',
        'status',
        'verified_by',
        'verified_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => StatusPembayaran::class,
            'amount' => 'integer',
            'verified_at' => 'datetime',
        ];
    }

    /**
     * Boot model — set default status.
     */
    protected static function booted(): void
    {
        static::creating(function (Payment $payment) {
            if (empty($payment->status)) {
                $payment->status = StatusPembayaran::BELUM_BAYAR;
            }
        });
    }

    // ─── State Transition Methods ───────────────────────────────

    /**
     * Upload bukti pembayaran → status WAITING_VERIFICATION.
     * Juga memungkinkan re-upload jika sebelumnya REJECTED.
     */
    public function uploadBukti(string $pathBukti): bool
    {
        $statusSaatIni = $this->status instanceof \BackedEnum ? $this->status->value : (string) $this->status;

        if (! in_array($statusSaatIni, [StatusPembayaran::BELUM_BAYAR->value, StatusPembayaran::DITOLAK->value], true)) {
            return false;
        }

        $this->proof_path = $pathBukti;
        $this->status = StatusPembayaran::MENUNGGU_VERIFIKASI;
        return $this->save();
    }

    /**
     * Verifikasi pembayaran → status PAID, booking → CONFIRMED.
     */
    public function verifikasi(int $verifierId): bool
    {
        $statusSaatIni = $this->status instanceof \BackedEnum ? $this->status->value : (string) $this->status;

        if ($statusSaatIni !== StatusPembayaran::MENUNGGU_VERIFIKASI->value) {
            return false;
        }

        $this->status = StatusPembayaran::LUNAS;
        $this->verified_by = $verifierId;
        $this->verified_at = now();
        $hasilSimpan = $this->save();

        // Otomatis konfirmasi booking terkait
        if ($hasilSimpan) {
            $this->booking->konfirmasi();
        }

        return $hasilSimpan;
    }

    /**
     * Tolak pembayaran → status REJECTED.
     */
    public function tolak(int $verifierId): bool
    {
        $statusSaatIni = $this->status instanceof \BackedEnum ? $this->status->value : (string) $this->status;

        if ($statusSaatIni !== StatusPembayaran::MENUNGGU_VERIFIKASI->value) {
            return false;
        }

        $this->status = StatusPembayaran::DITOLAK;
        $this->verified_by = $verifierId;
        $this->verified_at = now();
        return $this->save();
    }

    // ─── Relationships ──────────────────────────────────────────

    /**
     * Booking terkait.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * User yang memverifikasi.
     */
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
