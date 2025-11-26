<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\ConversationParticipant;
use App\Models\Conversation;

use App\Events\MessageSent;

class MessageController extends Controller
{
    public function index(Request $request, Conversation $conversation)
    {
        $user = $request->user();

        // Kiểm tra xem người dùng có phải là thành viên của cuộc trò chuyện không
        $isParticipant = ConversationParticipant::where('conversation_id', $conversation->id)
            ->where('user_id', $user->id)
            ->exists();

        if (!$isParticipant) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        // Eager load participants -> user, và messages kèm sender, đồng thời order messages
        $conversation->load([
            'participants.user',
            'messages' => function ($q) {
                $q->with('sender')->orderBy('created_at', 'asc');
            }
        ]);

        return response()->json($conversation, 200);
    }
    public function store(Request $request, $id)
    {
        $user = $request->user();

        // Kiểm tra xem người dùng có phải là thành viên của cuộc trò chuyện không
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

        broadcast(new \App\Events\MessageSent($message));
        
        return response()->json($message, 201);

    }


}