<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShowtimeResource extends JsonResource
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
            'movie_id' => $this->movie_id,
            'studio_id' => $this->studio_id,
            'show_date' => $this->show_date?->format('Y-m-d'),
            'start_time' => $this->start_time?->format('H:i'),
            'ticket_price' => $this->ticket_price,
            'movie' => new MovieResource($this->whenLoaded('movie')),
            'studio' => new StudioResource($this->whenLoaded('studio')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
