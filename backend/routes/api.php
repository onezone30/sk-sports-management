<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DivisionController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\SportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VenueController;
use App\Http\Controllers\VenueImageController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

Route::middleware(['auth:sanctum', 'active'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Users and roles mutate RBAC-sensitive data (role_id, role deletion), so
    // create/update/delete are Admin-only until real permission checks land
    // (see backend-rbac skill). index/show stay open to any signed-in user.
    Route::apiResource('users', UserController::class)->only(['index', 'show']);
    Route::apiResource('users', UserController::class)
        ->only(['store', 'update', 'destroy'])
        ->middleware('role:Admin');

    Route::apiResource('roles', RoleController::class)->only(['index', 'show']);
    Route::apiResource('roles', RoleController::class)
        ->only(['store', 'update', 'destroy'])
        ->middleware('role:Admin');

    Route::apiResource('venues', VenueController::class)->only(['index', 'show']);
    Route::apiResource('venues', VenueController::class)
        ->only(['store', 'update', 'destroy'])
        ->middleware('role:Admin');

    Route::post('venues/{venue}/images', [VenueImageController::class, 'store'])->middleware('role:Admin');
    Route::delete('venues/{venue}/images/{image}', [VenueImageController::class, 'destroy'])->middleware('role:Admin');
    Route::patch('venues/{venue}/images/{image}/primary', [VenueImageController::class, 'setPrimary'])->middleware('role:Admin');

    Route::apiResources([
        'seasons' => SeasonController::class,
        'sports' => SportController::class,
        'divisions' => DivisionController::class,
    ]);

    // Players carry no RBAC-sensitive fields, but store/update/destroy are kept
    // behind the same temporary role:Admin stopgap as users/roles until real
    // permission checks land (see backend-rbac skill).
    Route::apiResource('players', PlayerController::class)->only(['index', 'show']);
    Route::apiResource('players', PlayerController::class)
        ->only(['store', 'update', 'destroy'])
        ->middleware('role:Admin');
});
