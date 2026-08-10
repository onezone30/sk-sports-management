<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VenueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'address_line' => $this->address_line,
            'city' => $this->city,
            'state' => $this->state,
            'zip' => $this->zip,
            'capacity' => $this->capacity,
            'status' => $this->status?->toArray(),
            'description' => $this->description,
            'images' => VenueImageResource::collection($this->whenLoaded('images')),
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
