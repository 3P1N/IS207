<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\ConversationParticipant;
class MessageController extends Controller
{
    public function index(Request $request, $id)
    {
        $user = $request->user();

        // Kiểm tra xem người dùng có phải là thành viên của cuộc trò chuyện không
        $isParticipant = ConversationParticipant::where('conversation_id', $id)
            ->where('user_id', $user->id)
            ->exists();

        if (!$isParticipant) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Lấy tất cả tin nhắn trong cuộc trò chuyện
        $messages = Message::where('conversation_id', $id)
            ->orderBy('created_at', 'asc')
            ->with('sender')
            ->get();

        return response()->json($messages);
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
        return response()->json($message, 201);

    }


}