<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Movie extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'genre',
        'duration_minutes',
        'synopsis',
        'poster_path',
        'age_rating',
    ];

    // ─── Relationships ──────────────────────────────────────────

    /**
     * Jadwal tayang film ini.
     */
    public function showtimes(): HasMany
    {
        return $this->hasMany(Showtime::class);
    }
}
