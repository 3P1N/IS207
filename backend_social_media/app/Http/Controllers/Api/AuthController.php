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
        if (! $user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email not verified'], 403);
        }

        // 4️⃣ Tạo token cá nhân (Personal Access Token)
        $plainTextToken  = $user->createToken('api_token')->plainTextToken;

        $minutes = 60 * 24 * 30; // 30 days (ví dụ)
        $cookie = cookie(
            'api_token',            // tên cookie
            $plainTextToken,        // giá trị token (plaintext — browser nhận nhưng HttpOnly)
            $minutes,               // thời gian (phút)
            '/',                    // path
            null,// domain (null nếu ko dùng)
            true,                   // secure (true: chỉ gửi trên https)
            true,                   // httpOnly (true: JS không đọc được)
            false,                  // raw
            'None'              // SameSite (Lax/Strict/None)
        );

        // 5️⃣ Trả token về cho frontend
        return response()->json([
            'message' => 'Đăng nhập thành công',
            'user' => $user,
            'access_token' => $plainTextToken ,
            'token_type' => 'Bearer',
        ])->withCookie($cookie);
    }

    public function register(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        // Gửi email xác thực
        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực.',
        ]);
    }
    public function logout(Request $request)
    {
        // Lấy token từ cookie
        $token = $request->cookie('api_token');

        if ($token) {
            // Tìm và xóa token trong DB
            $tokenModel = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
            if ($tokenModel) {
                $tokenModel->delete();
            }
        }

        // Xóa cookie trên client (expire)
        $expiredCookie = cookie(
            'api_token',   // tên cookie
            '',            // giá trị rỗng
            -1,            // negative để hết hạn ngay
            '/',           // path
            null,          // domain (null nếu không dùng)
            false,         // secure (true nếu HTTPS)
            true,          // HttpOnly
            false,         // raw
            'None'         // SameSite
        );

        return response()->json([
            'message' => 'Đăng xuất thành công'
        ])->withCookie($expiredCookie);
    }

}
