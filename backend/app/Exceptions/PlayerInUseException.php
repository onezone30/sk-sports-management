<?php

namespace App\Exceptions;

use Exception;

class PlayerInUseException extends Exception
{
    public function __construct(int $id)
    {
        parent::__construct("Player with ID {$id} has recorded stats or roster history and cannot be deleted.");
    }
}
