<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Studio extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'capacity',
    ];

    // ─── Relationships ──────────────────────────────────────────

    /**
     * Kursi di studio ini.
     */
    public function seats(): HasMany
    {
        return $this->hasMany(Seat::class);
    }

    /**
     * Jadwal tayang di studio ini.
     */
    public function showtimes(): HasMany
    {
        return $this->hasMany(Showtime::class);
    }
}
