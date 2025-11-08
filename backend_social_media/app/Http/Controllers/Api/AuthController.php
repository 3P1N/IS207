<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Config\Sanctum;
use App\Models\User;

class AuthController extends Controller
{
   public function login(Request $request)
    {
        // 1️⃣ Kiểm tra dữ liệu đầu vào
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // 2️⃣ Thử đăng nhập (không tạo session)
        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid email or password',
            ], 401);
        }

        // 3️⃣ Lấy user hiện tại
        $user = Auth::user();   

        // 4️⃣ Tạo token cá nhân (Personal Access Token)
        $token = $user->createToken('api_token')->plainTextToken;

        // 5️⃣ Trả token về cho frontend
        return response()->json([
            'message' => 'Đăng nhập thành công',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
}
