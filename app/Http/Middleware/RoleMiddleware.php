<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $userTerautentikasi = $request->user();

        if (! $userTerautentikasi) {
            abort(403, 'Unauthorized.');
        }

        $roleList = [];
        foreach ($roles as $roleGroup) {
            foreach (preg_split('/\s*,\s*/', trim((string) $roleGroup), -1, PREG_SPLIT_NO_EMPTY) as $role) {
                $roleList[] = $role;
            }
        }

        if (empty($roleList)) {
            return $next($request);
        }

        if (! $userTerautentikasi->hasAnyRole($roleList)) {
            abort(403, 'Anda tidak memiliki akses ke halaman ini.');
        }

        return $next($request);
    }
}
