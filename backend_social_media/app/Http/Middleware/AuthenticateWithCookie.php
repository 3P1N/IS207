<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Auth;

class AuthenticateWithCookie
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->cookie('api_token');
        if(!$token){
            return response()->json(['message'=>"Unauthorized"], 401);
        }

        // findToken trả về model PersonalAccessToken nếu hợp lệ
        $tokenModel = PersonalAccessToken::findToken($token);
        if (!$tokenModel || !$tokenModel->tokenable) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
            // Set authenticated user for this request
        Auth::setUser($tokenModel->tokenable);
            // hoặc: $request->setUserResolver(fn() => $tokenModel->tokenable);
        
        return $next($request);
    }
}
