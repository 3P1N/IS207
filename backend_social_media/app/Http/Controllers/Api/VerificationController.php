<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Auth\Events\Verified;

class VerificationController extends Controller
{
    public function verifyStateless(Request $request)
    {
        if (! URL::hasValidSignature($request)) {
            return response()->json(['message' => 'Invalid or expired verification link.'], 403);
        }

        $user = User::find($request->id);
        if (! $user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if (! hash_equals((string) $request->hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Invalid verification data.'], 403);
        }

        if ($user->hasVerifiedEmail()) {
             return redirect()->away('http://localhost:5173/login?verified=already');
        }

        $user->markEmailAsVerified();
        event(new Verified($user));

        return redirect()->away('http://localhost:5173/login?verified=success');
    }
    
}
