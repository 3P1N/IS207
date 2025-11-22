<?php


namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Friendship; 
use Illuminate\Http\Request;
class UserController extends Controller{
    public function show(Request $request, $id){
        /** @var User|null $viewer */
        $viewer = $request->user();
        $user = User::findOrFail($id); 
        // --- 1. Xác định trạng thái quan hệ bạn bè ---
        $friendStatus = 'none';    // mặc định: không có quan hệ gì
        $friendshipId = null;      // để FE dùng nếu cần (unfriend / cancel request)
        $isOwnProfile = $viewer && $viewer->id === $user->id;

        if ($isOwnProfile) {
            // Chính chủ profile
            $friendStatus = 'self';
        } elseif ($viewer) {
            // Có người đăng nhập và đang xem profile của người khác
            $friendship = Friendship::betweenUsers($viewer->id, $user->id)->first();

            if ($friendship) {
                $friendshipId = $friendship->id;

                // CHÚ Ý: thay 'accepted' / 'pending' cho khớp với DB của bạn
                if ($friendship->status === 'accepted') {
                    $friendStatus = 'friends';

                } elseif ($friendship->status === 'pending') {
                    // Nếu mình là người gửi lời mời
                    if ($friendship->user_id === $viewer->id) {
                        $friendStatus = 'outgoing_request';   // mình gửi lời mời
                    } else {
                        $friendStatus = 'incoming_request';   // mình nhận lời mời
                    }
                }
            }
        }

        // --- 2. Đếm bạn bè & bạn chung ---
        // allFriends() là helper bạn nói là đã có trong model User
        $friendsOfUser = $user->allFriends();
        $friendsCount  = $friendsOfUser->count();

        $mutualCount = 0;
        if ($viewer && !$isOwnProfile) {
            $viewerFriendsIds = $viewer->allFriends()->pluck('id');
            $userFriendIds    = $friendsOfUser->pluck('id');
            $mutualCount      = $viewerFriendsIds->intersect($userFriendIds)->count();
        }

        // --- 3. Trả về JSON cho FE ---
        return response()->json([
            'user' => [
                'id'                   => $user->id,
                'name'                 => $user->name,
                'email'                => $user->email,
                'avatarUrl'            => $user->avatarUrl, // đúng tên cột trong DB
                'gender'               => $user->gender,
                'role'                 => $user->role,
                'is_Violated'          => $user->is_Violated,
                'joinDate'             => optional($user->created_at)->format('d/m/Y'),

                'friend_status'        => $friendStatus,    // none/self/friends/outgoing_request/incoming_request
                'friendship_id'        => $friendshipId,    // để unfriend / cancel nếu cần
                'friends_count'        => $friendsCount,
                'mutual_friends_count' => $mutualCount,
                'is_own_profile'       => $isOwnProfile,
            ],
        ]);
    }
    public function index(Request $request){
        $user = $request->user();
        if(!$user){
            return response()->json(['message' => "Unauthorize"], 401);
        }
        $keyword = trim($request->query('search', ''));
        $users = User::when(!empty($keyword), function($q) use($keyword){
                $q->where('name', 'like', "%{$keyword}%")->orWhere('email', 'like', "%{$keyword}%");
            })
            ->where('is_Violated', false)
            ->get();
        return response()->json($users, 200); 
    }
}
