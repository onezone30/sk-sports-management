<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Season extends Model
{
    /** @use HasFactory<\Database\Factories\SeasonFactory> */
    use HasApiTokens, HasFactory, Notifiable;


    protected $fillable = [
        'chairman_id', 
        'name', 
        'year', 
        'start_date', 
        'end_date', 
        'status'
    ];


    public function chairman()
    {
        return $this->belongsTo(User::class, 'chairman_id');
    }

    public function sports()
    {
        return $this->hasMany(Sport::class);
    }

    public function divisions()
    {
        return $this->hasManyThrough(Division::class, Sport::class);
    }

    public function teams()
    {
        return $this->hasManyThrough(Team::class, Division::class);
    }

    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }
}
