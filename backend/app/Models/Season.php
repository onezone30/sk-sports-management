<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Season extends Model
{
    /** @use HasFactory<\Database\Factories\SeasonFactory> */
    use HasFactory;

    protected $fillable = [
        'sport_id', 
        'handler_id', 
        'name', 
        'year', 
        'start_date', 
        'end_date', 
        'status'
    ];


    public function sport()
    {
        return $this->belongsTo(Sport::class);
    }

    public function handler()
    {
        return $this->belongsTo(User::class, 'handler_id');
    }

    public function teams()
    {
        return $this->hasMany(Team::class);
    }

    public function games()
    {
        return $this->hasMany(Game::class);
    }

    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }
}
