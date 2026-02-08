<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    /** @use HasFactory<\Database\Factories\TeamFactory> */
    use HasFactory;

    protected $fillable = [
        'handler_id', 
        'division_id', 
        'name', 
        'slug', 
        'street', 
        'description', 
        'status'
    ];

    public function handler()
    {
        return $this->belongsTo(User::class, 'handler_id');
    }

    public function division()
    {
        return $this->belongsTo(Division::class);
    }

    public function teamPlayers()
    {
        return $this->hasMany(TeamPlayer::class);
    }

    public function homeGames()
    {
        return $this->hasMany(Game::class, 'home_team_id');
    }

    public function awayGames()
    {
        return $this->hasMany(Game::class, 'away_team_id');
    }
}
