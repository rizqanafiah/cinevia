<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Showtime extends Model
{
    use HasFactory;

    protected $fillable = [
        'movie_id',
        'studio_id',
        'show_date',
        'start_time',
        'ticket_price',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'show_date' => 'date',
            'start_time' => 'datetime:H:i',
            'ticket_price' => 'integer',
        ];
    }

    // ─── Relationships ──────────────────────────────────────────

    /**
     * Film yang ditayangkan.
     */
    public function movie(): BelongsTo
    {
        return $this->belongsTo(Movie::class);
    }

    /**
     * Studio tempat tayang.
     */
    public function studio(): BelongsTo
    {
        return $this->belongsTo(Studio::class);
    }

    /**
     * Booking pada jadwal tayang ini.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
