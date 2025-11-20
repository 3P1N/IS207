<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;


class FriendController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        
        // Lấy danh sách bạn bè của user hiện tại
        $friends = $user->allFriends();

        return response()->json([
            'friends' => $friends,
        ]);
    }
}