<?php


namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Friendship; 
use Illuminate\Http\Request;
use App\Models\Post;
class UserController extends Controller{
    public function show(Request $request, User $user){

        $viewer = $request->user();
        if(!$viewer){
            return response()->JSON(['message'=>"UnAuthorized"],401);
        } 
        if(!$user || $user->is_Violated){
            return response()->json(['message'=>'user not found'],404);
        }
        
   
        $friendStatus = 'none';    
        $friendshipId = null;     
        $isOwnProfile = $viewer && $viewer->id === $user->id;

        if ($isOwnProfile) {
            
            $friendStatus = 'self';
        } elseif ($viewer) {
            // Có người đăng nhập và đang xem profile của người khác
            $friendship = Friendship::betweenUsers($viewer->id, $user->id)->first();

            if ($friendship) {
                $friendshipId = $friendship->id;

                if ($friendship->status === 'accepted') {
                    $friendStatus = 'friends';

                } elseif ($friendship->status === 'pending') {
                   
                    if ($friendship->user_id === $viewer->id) {
                        $friendStatus = 'outgoing_request';   // mình gửi lời mời
                    } else {
                        $friendStatus = 'incoming_request';   // mình nhận lời mời
                    }
                }
            }
        }

       
        $friendsOfUser = $user->allFriends();
        $friendsCount  = $friendsOfUser->count();

        $mutualCount = 0;
        if ($viewer && !$isOwnProfile) {
            $viewerFriendsIds = $viewer->allFriends()->pluck('id');
            $userFriendIds    = $friendsOfUser->pluck('id');
            $mutualCount      = $viewerFriendsIds->intersect($userFriendIds)->count();
        }

        return response()->json([
            'user' => [
                'id'                   => $user->id,
                'name'                 => $user->name,
                'email'                => $user->email,
                'avatarUrl'            => $user->avatarUrl, 
                'gender'               => $user->gender,
                'role'                 => $user->role,
                'is_Violated'          => $user->is_Violated,
                'joinDate'             => optional($user->created_at)->format('d/m/Y'),

                'friend_status'        => $friendStatus,    
                'friendship_id'        => $friendshipId, 
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
                $q->where('name', 'like', "%{$keyword}%");
            })
            ->where('is_Violated', false)
            ->get();
        return response()->json($users, 200); 
    }
    public function getpost(Request $request,User $user){
        $userId = $user->id;
        $viewer=$request->user();
        $viewerId=$viewer->id;
        $posts = Post::where('is_visible', true)
                ->whereNull('deleted_at') 
                ->whereDoesntHave('reports', function($query) use ($viewerId) {
                    $query->where('reporter_id', $viewerId);
                })
                ->where(function ($q) use ($userId) {
                    $q->where('user_id', $userId)
                    ->orWhereHas('shares', function ($sq) use ($userId) {
                        $sq->where('user_id', $userId);
                    });
                })
                ->withCount(['reactions', 'comments', 'shares'])
                ->with(['user', 'media'])
                ->withExists([
                    'reactions as is_liked' => function ($q) use ($viewerId) {
                        $q->where('user_id', $viewerId);
                    }
                ])
                ->withExists([
                    'shares as is_shared' => function ($q) use ($viewerId) {
                        $q->where('user_id', $viewerId);
                    }
                ])
                ->orderBy('created_at', 'desc')
                ->simplePaginate(10);

        return response()->json($posts, 200);
    }
    public function updateProfile(Request $request, User $user)
    {
        $user = $request->user();
        
        $data = $request->only([
            'name',
            'email',
            'gender',
            'avatarUrl'
        ]);

         $user->update($data);

        return response()->json([
            'message' => 'Cập nhật thông tin thành công',
            'user'    => $user,
        ],200);
    }
}
