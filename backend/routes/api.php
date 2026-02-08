<?php

use App\Http\Controllers\DivisionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\SportController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);

Route::middleware(['auth:sanctum', 'active'])->group(function () {
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
    
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/user/{id}', [UserController::class, 'show']);
    Route::patch('/user/{id}', [UserController::class, 'update']);
    Route::delete('/user/{id}', [UserController::class, 'destroy']);

    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::get('/role/{id}', [RoleController::class, 'show']);
    Route::patch('/role/{id}', [RoleController::class, 'update']);
    Route::delete('/role/{id}', [RoleController::class, 'destroy']);

    Route::get('/seasons', [SeasonController::class, 'index']);
    Route::post('/seasons', [SeasonController::class, 'store']);
    Route::get('/season/{id}', [SeasonController::class, 'show']);
    Route::patch('/season/{id}', [SeasonController::class, 'update']);
    Route::delete('/season/{id}', [SeasonController::class, 'destroy']);

    Route::get('/sports', [SportController::class, 'index']);
    Route::post('/sports', [SportController::class, 'store']);
    Route::get('/sport/{id}', [SportController::class, 'show']);
    Route::patch('/sport/{id}', [SportController::class, 'update']);
    Route::delete('/sport/{id}', [SportController::class, 'destroy']);

    Route::get('/divisions', [DivisionController::class, 'index']);
    Route::post('/divisions', [DivisionController::class, 'store']);
    Route::get('/division/{id}', [DivisionController::class, 'show']);
    Route::patch('/division/{id}', [DivisionController::class, 'update']);
    Route::delete('/division/{id}', [DivisionController::class, 'destroy']);
});
