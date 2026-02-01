<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlayerStats extends Model
{
    protected $fillable = [
        'player_id',
        'game_id',
        'stats',
        'games_played',
    ];

    protected $casts = [
        'stats' => 'array',
    ];

    public function player()
    {
        return $this->belongsTo(Player::class);
    }

    public function game()
    {
        return $this->belongsTo(Game::class);
    }

}
