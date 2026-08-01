<?php

namespace App\Services;

use App\Enums\ActiveStatus;
use App\Exceptions\InactiveAccountException;
use App\Exceptions\InvalidCredentialsException;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    /**
     * @return array{user: User, token: string}
     */
    public function login(array $credentials): array
    {
        if (! Auth::attempt($credentials)) {
            throw new InvalidCredentialsException;
        }

        /** @var User $user */
        $user = Auth::user();

        if ($user->status !== ActiveStatus::ACTIVE) {
            Auth::logout();
            throw new InactiveAccountException;
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return ['user' => $user->load('role'), 'token' => $token];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }
}
