<?php

namespace App\Models;

use App\Enums\SportsType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sport extends Model
{
    /** @use HasFactory<\Database\Factories\SportFactory> */
    use HasFactory;

    protected $casts = [
        'name' => SportsType::class,
    ];

    protected $fillable = [
        'season_id',
        'name',
        'category',
        'max_players_per_team',
        'status',
    ];

    public function season()
    {
        return $this->belongsTo(Season::class);
    }

    public function divisions()
    {
        return $this->hasMany(Division::class);
    }
}
