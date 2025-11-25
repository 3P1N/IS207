<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Friendship;
use Illuminate\Http\Request;
use App\Models\User;


class FriendShipController extends Controller
{
    public function getfriend(User $user)
    {
        
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        
        // Lấy danh sách bạn bè của user hiện tại
        $friends = $user->allFriendss();

        return response()->json([
            'friends' => $friends,
        ]);
    }
    public function getsuggest(User $user){
        $friends=$user->getSuggestFriends();
        return response()->json([
            'friend'=>$friends,
        ]);
    }
    public function deletefriendship(Friendship $friendship){
        $friendship->delete();
        return response()->json([
        'message' => 'Đã xóa mối quan hệ bạn bè thành công',
    ]);
    }
}