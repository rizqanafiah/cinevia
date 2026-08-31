<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingSeat extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'seat_id',
    ];

    // ─── Relationships ──────────────────────────────────────────

    /**
     * Booking terkait.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Kursi yang dibooking.
     */
    public function seat(): BelongsTo
    {
        return $this->belongsTo(Seat::class);
    }
}
