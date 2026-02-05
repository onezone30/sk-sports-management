<?php

namespace App\Enums;

enum SportsType : string
{
    case BASKETBALL = 'basketball';
    case VOLLEYBALL = 'volleyball';
    case MOBILE_LEGENDS = 'mobile_legends';
    case CHESS = 'chess';
    case BADMINTON = 'badminton';
    
    public function label(): string
    {
        return match($this) {
            self::BASKETBALL => 'Basketball',
            self::VOLLEYBALL => 'Volleyball',
            self::MOBILE_LEGENDS => 'Mobile Legends',
            self::CHESS => 'Chess',
            self::BADMINTON => 'Badminton',
        };
    }

    public function stats()
    {
        return match($this) {
            self::BASKETBALL => ['points', 'rebounds', 'assists', 'steals', 'blocks'],
            self::VOLLEYBALL => ['kills', 'assists', 'aces', 'blocks', 'digs'],
            self::MOBILE_LEGENDS => ['kills', 'deaths', 'assists', 'hero'],
            self::CHESS => ['wins', 'losses', 'draws', 'rating'],
            self::BADMINTON => ['matches_won', 'matches_lost', 'sets_won', 'sets_lost'],
        };
    }

    public function category()
    {
        return match($this) {
            self::BASKETBALL, self::VOLLEYBALL, self::MOBILE_LEGENDS => 'team',
            self::CHESS, self::BADMINTON => 'individual',
        };
    }
}
