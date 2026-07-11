<?php

namespace App\Traits;

trait HasPermissions
{
    public function hasPermission(string $permission): bool
    {
        $this->loadMissing('permissions');
        return $this->permissions->contains('name', $permission);
    }
}
