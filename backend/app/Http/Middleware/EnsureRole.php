<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Temporary stopgap until the permission system (permissions / permission_user)
 * is seeded and enforced. Gates a route to users whose role name matches one
 * of the given values, e.g. `role:Admin`.
 *
 * Replace with the `permission` middleware (see backend-rbac skill) once the
 * permission tables are populated — this class should not gain new features.
 */
class EnsureRole
{
    /**
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! $user->role || ! in_array($user->role->name, $roles, true)) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return $next($request);
    }
}
