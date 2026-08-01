<?php

namespace App\Exceptions;

use Exception;

class RoleInUseException extends Exception
{
    public function __construct(int $id)
    {
        parent::__construct("Role with ID {$id} is still assigned to one or more users and cannot be deleted.");
    }
}
