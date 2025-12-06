<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\ConversationParticipant;
use App\Models\Conversation;

use App\Events\MessageSent;
use App\Events\ConversationSent;


class MessageController extends Controller
{
    public function index(Request $request, Conversation $conversation)
    {
        $user = $request->user();

        // 1. Check quyền (giữ nguyên logic của bạn)
        $participant = ConversationParticipant::where('conversation_id', $conversation->id)
            ->where('user_id', $user->id)
            ->first();

        if (!$participant) {
            return response()->json(['message' => 'Forbidden'], 403);
        }


        // 2. Load thông tin Conversation và Participants (không load messages ở đây nữa)
        $conversation->load(['participants.user']);

        // 3. Load Messages riêng biệt để lấy object phân trang chuẩn
        // Lấy tin nhắn MỚI NHẤT trước (DESC) để trang 1 là tin mới nhất, trang 2 cũ hơn...
        $messages = $conversation->messages()
            ->with('sender')
            ->orderBy('created_at', 'desc')
            ->cursorPaginate(20);

        $lastMessage = $messages->first();
        if ($lastMessage && $lastMessage->id > $participant->last_seen_message_id) {
            $participant->update([
                'last_seen_message_id' => $lastMessage->id
            ]);
        }

        // 4. Trả về format tách biệt để frontend dễ xử lý
        return response()->json([
            'conversation' => $conversation,
            'messages' => $messages // Object này chứa data, next_page_url, prev_page_url...
        ], 200);
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
        
        $participantIds = ConversationParticipant::where('conversation_id', $id)
        ->pluck('user_id')
        ->toArray();

        broadcast(new \App\Events\MessageSent($message));
        broadcast(new \App\Events\ConversationSent($message, $participantIds) );
        
        return response()->json($message, 201);

    }


}