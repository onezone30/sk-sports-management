<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'active' => \App\Http\Middleware\CheckInactivity::class,
            'role' => \App\Http\Middleware\EnsureRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\App\Exceptions\RoleInUseException $e) {
            return response()->json(['message' => $e->getMessage()], 409);
        });

        $exceptions->render(function (\App\Exceptions\InactiveAccountException $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        });

        $exceptions->render(function (\App\Exceptions\InvalidCredentialsException $e) {
            return response()->json(['message' => $e->getMessage()], 401);
        });
    })->create();
