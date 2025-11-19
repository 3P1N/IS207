<?php

namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;

class EnsureEmailIsVerifiedForApi
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && ! $user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Your email address is not verified.'
            ], 403);
        }

        return $next($request);
    }
}

