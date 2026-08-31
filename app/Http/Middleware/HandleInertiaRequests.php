<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        $rolePriority = ['admin', 'staff', 'customer'];
        $roles = $user
            ? $user->roles
                ->pluck('name')
                ->unique()
                ->map(fn ($role) => strtolower((string) $role))
                ->sortBy(fn ($role) => array_search($role, $rolePriority, true) === false ? 99 : array_search($role, $rolePriority, true))
                ->values()
                ->toArray()
            : [];

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $roles,
                ] : null,
            ],
            'flash' => [
                'sukses' => fn () => $request->session()->get('sukses'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
