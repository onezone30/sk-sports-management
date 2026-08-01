<?php

namespace App\Exceptions;

use Exception;

class InactiveAccountException extends Exception
{
    public function __construct()
    {
        parent::__construct('This account is not active. Contact an administrator.');
    }
}
