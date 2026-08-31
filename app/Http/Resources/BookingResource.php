<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
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
            'user_id' => $this->user_id,
            'showtime_id' => $this->showtime_id,
            'booking_code' => $this->booking_code,
            'status' => $this->status?->value,
            'total_price' => $this->total_price,
            'expired_at' => $this->expired_at?->toISOString(),
            'showtime' => new ShowtimeResource($this->whenLoaded('showtime')),
            'user' => new UserResource($this->whenLoaded('user')),
            'booking_seats' => BookingSeatResource::collection($this->whenLoaded('bookingSeats')),
            'payment' => new PaymentResource($this->whenLoaded('payment')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
