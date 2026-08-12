<?php

namespace App\Models;

use App\Enums\Status;
use Illuminate\Database\Eloquent\Model;

class TeamPlayer extends Model
{
    protected $fillable = [
        'team_id',
        'player_id',
        'jersey_number',
        'position',
        'is_captain',
        'height_cm',
        'weight_kg',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'is_captain' => 'boolean',
            'status' => Status::class,
        ];
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function player()
    {
        return $this->belongsTo(Player::class);
    }
}
