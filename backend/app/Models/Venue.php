<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venue extends Model
{
    protected $fillable = [
        'name',
        'address'
    ];

    public function games()
    {
        return $this->hasMany(Game::class);
    }
}
