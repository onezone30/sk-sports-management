<?php

namespace App\Exceptions;

use Exception;

class VenueImageLimitExceededException extends Exception
{
    public function __construct()
    {
        parent::__construct('Maximum of 8 images per venue.');
    }
}
