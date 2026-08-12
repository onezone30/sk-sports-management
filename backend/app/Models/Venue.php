<?php

namespace App\Models;

use App\Enums\Status;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Venue extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address_line',
        'city',
        'state',
        'zip',
        'capacity',
        'status',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'status' => Status::class,
            'capacity' => 'integer',
        ];
    }

    public function games(): HasMany
    {
        return $this->hasMany(Game::class);
    }

    public function images(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable')
            ->where('type', 'image')
            ->orderByDesc('is_primary')
            ->orderBy('id');
    }
}
