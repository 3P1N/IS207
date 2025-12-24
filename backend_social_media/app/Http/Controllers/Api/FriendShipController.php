<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Friendship;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ConversationParticipant;
use App\Models\Conversation;


class FriendShipController extends Controller
{
    public function getfriend(Request $request, User $user)
    {
        
        $viewer = $request->user();

        // Lấy danh sách bạn bè
        $friends = $user->allFriendss()
            ->map(function ($friend) use ($viewer) {
                // Nếu chính viewer = friend
                if ($viewer->id === $friend->id) {
                    $friend->relationship_with_viewer = 'self';
                    return $friend;
                }

                // Tìm mối quan hệ giữa viewer và từng friend
                $friendship = Friendship::betweenUsers($viewer->id, $friend->id)->first();

                if (!$friendship) {
                    // Không có record friendship => chưa liên quan gì
                    $friend->relationship_with_viewer = 'none';
                }
                else {
                    // fallback: trả về đúng status trong DB (blocked, rejected, ...)
                    $friend->relationship_with_viewer = $friendship->status;
                    
                }

                return $friend;
            });

        return response()->json([
            'friends' => $friends,
        ], 200);
    }
    public function getsuggest(User $user){
        $friends=$user->getSuggestFriends();
        return response()->json([
            'friend'=>$friends,
        ],200);
    }
    public function deletefriendship(Request $request,Friendship $friendship){
        $user=$request->user();
        if($user->id!==$friendship->user_id && $user->id!==$friendship->addressee_id){
            return response()->json([
                'message' => 'Forbidden',
            ], 403);
        }
        $friendship->delete();
        return response()->json([
        'message' => 'Đã xóa mối quan hệ bạn bè thành công',
    ],200);
    }
    public function addfriend(Request $request){
        $user=$request->user();
        $addressee_id = $request->addressee_id;
        if ($user->id == $addressee_id) {
            return response()->json([
                'message' => 'Bạn không thể gửi lời mời kết bạn cho chính mình.'
            ], 400);
        }
        $existingFriendship = Friendship::where(function ($query) use ($user, $addressee_id) {
            $query->where('user_id', $user->id)
                  ->where('addressee_id', $addressee_id);
        })->orWhere(function ($query) use ($user, $addressee_id) {
            $query->where('user_id', $addressee_id)
                  ->where('addressee_id', $user->id);
        })->first();

        if($existingFriendship){
            return response()->json(['message' => 'Đã tồn tại'], 409);
        }
        $friendship = Friendship::create([
            'user_id'=>$user->id,
            'addressee_id'=>$addressee_id
        ]);
        
        return response()->json($friendship,201);
    }
    public function acceptfriend(Request $request, Friendship $friendship){
       
        $user = $request->user();
        if (!$user || $user->id !== $friendship->addressee_id) {
            return response()->json([
                'message' => 'Bạn không có quyền chấp nhận lời mời này',
            ], 403);
        }
        $addressee_id = $friendship->user_id;

        // cập nhật trạng thái
        $friendship->update([
            'status' => 'accepted',
        ]);

        $existingConversation = Conversation::whereHas('participants', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })->whereHas('participants', function ($q) use ($addressee_id) {
            $q->where('user_id', $addressee_id);
        })->first();

        if(!$existingConversation){
            $conversation = Conversation::create([ 'name' => null ]);
            ConversationParticipant::create([
                'conversation_id'=>$conversation->id,
                'user_id'=>$user->id
            ]);
            
            ConversationParticipant::create([
                'conversation_id'=>$conversation->id,
                'user_id'=>$addressee_id
            ]);
        }   

        return response()->json([
            'message' => 'Đã chấp nhận lời mời kết bạn',
            'friendship' => $friendship,
            'existingConversation' => $existingConversation,
        ], 200);
    }
}