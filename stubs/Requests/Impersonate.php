<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Wyxos\Harmonie\Resource\FormRequest;

class Impersonate extends FormRequest
{
    public function handle(): RedirectResponse
    {
        if (app()->environment('production')) {
            abort(404);
        }

        $email = $this->route('email');

        $builder = User::query();

        /** @var User $user */
        $user = $email ? $builder->where('email', $email)->firstOrFail() : $builder->inRandomOrder()->first();

        Auth::login($user);

        return redirect()->route('dashboard');
    }
}
