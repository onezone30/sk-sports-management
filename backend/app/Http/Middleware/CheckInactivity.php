<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckInactivity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        if ($user = $request->user()) {
            $token = $user->currentAccessToken();

            if ($token) {
                if (is_null($token->last_used_at)) {
                    $token->forceFill(['last_used_at' => now()])->save();
                    return $next($request);
                }

                $minutesInactive = $token->last_used_at->diffInMinutes(now());

                if ($minutesInactive >= 15) { 
                    $token->delete();
                    return response()->json(['message' => 'Session expired due to inactivity'], 401);
                }

                $token->forceFill(['last_used_at' => now()])->save();
            }
        }

        return $next($request);
    }
}
