<?php

use App\Http\Controllers\SocialAuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/auth/github', [SocialAuthController::class, 'redirectToGitHub']);
Route::get('/auth/github/callback', [SocialAuthController::class, 'handleGitHubCallback']);
