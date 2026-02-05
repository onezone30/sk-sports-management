<?php

namespace App\Enums;

enum TeamStatus : string
{
    case ACTIVE = 'active';
    case PENDING = 'pending';
    case VERIFIED = 'verified';
    case SUSPENDED = 'suspended';
    case DISQUALIFIED = 'disqualified';
    case WITHDRAWN = 'withdrawn';
}
