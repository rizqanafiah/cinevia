<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
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
            'booking_id' => $this->booking_id,
            'amount' => $this->amount,
            'proof_path' => $this->proof_path,
            'status' => $this->status?->value,
            'verified_by' => $this->verified_by,
            'verified_at' => $this->verified_at?->toISOString(),
            'verifier' => new UserResource($this->whenLoaded('verifier')),
            'booking' => new BookingResource($this->whenLoaded('booking')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
