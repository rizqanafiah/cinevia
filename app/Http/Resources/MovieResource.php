<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MovieResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'genre' => $this->genre,
            'duration_minutes' => $this->duration_minutes,
            'synopsis' => $this->synopsis,
            'poster_path' => $this->poster_path,
            'age_rating' => $this->age_rating,
            'showtimes' => ShowtimeResource::collection($this->whenLoaded('showtimes')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
