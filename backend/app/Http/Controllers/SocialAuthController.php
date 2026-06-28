<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    public function redirectToGitHub()
    {
        return Socialite::driver('github')->redirect();
    }

    public function handleGitHubCallback()
    {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

        try {
            $githubUser = Socialite::driver('github')->user();
        } catch (\Exception $e) {
            return redirect($frontendUrl . '/login?error=github_auth_failed');
        }

        if (!$githubUser->getEmail()) {
            return redirect($frontendUrl . '/login?error=github_no_email');
        }

        $user = User::where('github_id', $githubUser->getId())->first();

        if (!$user) {
            $user = User::where('email', $githubUser->getEmail())->first();

            if ($user) {
                $user->update(['github_id' => $githubUser->getId()]);
            } else {
                $defaultRole = Role::where('name', 'Spectator')->first();

                if (!$defaultRole) {
                    return redirect($frontendUrl . '/login?error=no_default_role');
                }

                $user = User::create([
                    'name' => $githubUser->getName() ?? $githubUser->getNickname(),
                    'email' => $githubUser->getEmail(),
                    'github_id' => $githubUser->getId(),
                    'password' => Str::random(40),
                    'role_id' => $defaultRole->id,
                ]);
            }
        }

        $token = $user->createToken('github_token')->plainTextToken;

        $userJson = urlencode(json_encode($user->load('role')));

        return redirect($frontendUrl . '/auth/github/callback?token=' . $token . '&user=' . $userJson);
    }
}
