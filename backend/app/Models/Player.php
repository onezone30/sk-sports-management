<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    /** @use HasFactory<\Database\Factories\PlayerFactory> */
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'date_of_birth',
        'status'
    ];

    public function teamPlayers()
    {
        return $this->belongsTo(TeamPlayer::class);
    }

    public function playerStats()
    {
        return $this->hasMany(PlayerStats::class);
    }
}
