<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\ConversationParticipant;
use App\Models\Conversation;

use App\Events\MessageSent;
use App\Events\MessageRead;
use App\Events\ConversationSent;


class MessageController extends Controller
{
    public function index(Request $request, Conversation $conversation)
    {
        $user = $request->user();

        //Check quyền
        $participant = ConversationParticipant::where('conversation_id', $conversation->id)
            ->where('user_id', $user->id)
            ->first();

        if (!$participant) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        //Load quan hệ
        $conversation->load(['participants.user']);

        // Logic tính toán số lượng tin cần lấy 
        $perPage = 20;
        $shouldUpdateReadStatus = false;

        // load trang đầu (không có cursor)
        if (!$request->has('cursor')) {
            $lastReadAt = $participant->last_read_message_id;
            
            
            if ($lastReadAt) {
                $unreadCount = $conversation->messages()
                    ->where('id', '>', $lastReadAt) 
                    ->count();
                $perPage = max(20, $unreadCount);
            }
            
            $shouldUpdateReadStatus = true;
        }

        
        $messages = $conversation->messages()
            ->with('sender')
            ->orderBy('created_at', 'desc')
            ->cursorPaginate($perPage);

        //Update trạng thái đã đọc 
        if ($shouldUpdateReadStatus) {
            $lastMessage = $messages->first();
            
            if ($lastMessage && $lastMessage->id > $participant->last_read_message_id) {
                
                
                $participant->update([
                    'last_read_message_id' => $lastMessage->id,
                    'last_read_at' => now() 
                ]);

                
                broadcast(new \App\Events\MessageRead($conversation->id, $user->id, $lastMessage->id))->toOthers();
            }
        }

        return response()->json([
            'conversation' => $conversation,
            'messages' => $messages
        ], 200);
    }
    public function store(Request $request, $id)
    {
        $user = $request->user();

        // Kiểm tra xem người dùng có phải là thành viên
        $isParticipant = ConversationParticipant::where('conversation_id', $id)
            ->where('user_id', $user->id)
            ->exists();

        if (!$isParticipant) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Tạo tin nhắn mới
        $message = Message::create([
            'conversation_id' => $id,
            'sender_id' => $user->id,
            'content' => $request->input('content'),
        ]);
        $message->load('sender');
        
        $participantIds = ConversationParticipant::where('conversation_id', $id)
        ->pluck('user_id')
        ->toArray();

        broadcast(new \App\Events\MessageSent($message));
        broadcast(new \App\Events\ConversationSent($message, $participantIds) );
        
        return response()->json($message, 201);

    }

    public function updateLastReadMessage(Request $request, Conversation $conversation, Message $message){
        $user = $request->user();
        $conversationId = $conversation->id;
        $messageId = $message->id;
        // Kiểm tra xem người dùng có phải là thành viê
        $participant = ConversationParticipant::where('conversation_id', $conversationId)
            ->where('user_id', $user->id)
            ->first();

        if (!$participant) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        
        $participant->update(['last_read_message_id'=>$messageId]);
        return response()->json(['message' => 'updated last seen message successfully'],200);
    }

}