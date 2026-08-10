<?php

namespace App\Models;

use App\Enums\Gender;
use App\Enums\Status;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Player extends Model
{
    /** @use HasFactory<\Database\Factories\PlayerFactory> */
    use HasFactory;

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'date_of_birth',
        'gender',
        'email',
        'phone',
        'emergency_contact_name',
        'emergency_contact_phone',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'gender' => Gender::class,
            'status' => Status::class,
        ];
    }

    public function teamPlayers(): HasMany
    {
        return $this->hasMany(TeamPlayer::class);
    }

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_players')
            ->withPivot(['jersey_number', 'position', 'is_captain'])
            ->withTimestamps();
    }

    public function playerStats(): HasMany
    {
        return $this->hasMany(PlayerStats::class);
    }

    /** Derived, never stored — always reflects today's date against date_of_birth. */
    protected function age(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->date_of_birth?->age,
        );
    }

    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => collect([$this->first_name, $this->middle_name, $this->last_name, $this->suffix])
                ->filter()
                ->implode(' '),
        );
    }
}
