<?php

namespace App\Models;

use App\Enums\StatusBooking;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'showtime_id',
        'booking_code',
        'status',
        'total_price',
        'expired_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => StatusBooking::class,
            'total_price' => 'integer',
            'expired_at' => 'datetime',
        ];
    }

    /**
     * Boot model — auto-generate booking_code & set default status + expired_at.
     */
    protected static function booted(): void
    {
        static::creating(function (Booking $booking) {
            if (empty($booking->booking_code)) {
                $booking->booking_code = 'CNV-' . strtoupper(Str::random(8));
            }
            if (empty($booking->status)) {
                $booking->status = StatusBooking::MENUNGGU;
            }
            if (empty($booking->expired_at)) {
                $booking->expired_at = now()->addMinutes(30);
            }
        });
    }

    // ─── State Transition Methods ───────────────────────────────

    /**
     * Konfirmasi booking setelah pembayaran diverifikasi.
     */
    public function konfirmasi(): bool
    {
        $statusSaatIni = $this->status instanceof \BackedEnum ? $this->status->value : (string) $this->status;

        if ($statusSaatIni !== StatusBooking::MENUNGGU->value) {
            return false;
        }

        $this->status = StatusBooking::DIKONFIRMASI;
        return $this->save();
    }

    /**
     * Batalkan booking.
     */
    public function batalkan(): bool
    {
        $statusSaatIni = $this->status instanceof \BackedEnum ? $this->status->value : (string) $this->status;

        if ($statusSaatIni !== StatusBooking::MENUNGGU->value) {
            return false;
        }

        $this->status = StatusBooking::DIBATALKAN;
        return $this->save();
    }

    // ─── Query Helpers ──────────────────────────────────────────

    /**
     * Cek apakah booking sudah kedaluwarsa.
     */
    public function sudahKedaluwarsa(): bool
    {
        return $this->expired_at && $this->expired_at->isPast();
    }

    // ─── Relationships ──────────────────────────────────────────

    /**
     * User pemilik booking.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Jadwal tayang yang dibooking.
     */
    public function showtime(): BelongsTo
    {
        return $this->belongsTo(Showtime::class);
    }

    /**
     * Kursi yang dibooking.
     */
    public function bookingSeats(): HasMany
    {
        return $this->hasMany(BookingSeat::class);
    }

    /**
     * Pembayaran booking (1:1).
     */
    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }
}
