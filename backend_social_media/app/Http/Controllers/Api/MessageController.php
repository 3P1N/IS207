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

        // 1. Check quyền
        $participant = ConversationParticipant::where('conversation_id', $conversation->id)
            ->where('user_id', $user->id)
            ->first();

        if (!$participant) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // 2. Load quan hệ
        $conversation->load(['participants.user']);

        // 3. Logic tính toán số lượng tin cần lấy (Tránh lỗi mất tin unread)
        $perPage = 20;
        $shouldUpdateReadStatus = false;

        // Chỉ tính toán logic phức tạp khi load trang đầu (không có cursor)
        if (!$request->has('cursor')) {
            $lastReadAt = $participant->last_read_message_id; // Giả sử bạn lưu ID, hoặc dùng timestamp tùy DB
            
            // Đếm số tin chưa đọc để lấy cho đủ
            // Lưu ý: So sánh ID chỉ đúng nếu ID tăng dần (auto-increment hoặc ULID/Snowflake). 
            // Nếu dùng UUID v4 ngẫu nhiên thì phải so sánh created_at.
            if ($lastReadAt) {
                $unreadCount = $conversation->messages()
                    ->where('id', '>', $lastReadAt) 
                    ->count();
                $perPage = max(20, $unreadCount);
            }
            
            $shouldUpdateReadStatus = true;
        }

        // 4. Query Messages
        $messages = $conversation->messages()
            ->with('sender')
            ->orderBy('created_at', 'desc')
            ->cursorPaginate($perPage);

        // 5. Update trạng thái đã đọc (Chỉ chạy ở trang đầu và nếu có tin mới hơn)
        if ($shouldUpdateReadStatus) {
            $lastMessage = $messages->first(); // Tin mới nhất trong đám vừa lấy
            
            if ($lastMessage && $lastMessage->id > $participant->last_read_message_id) {
                
                // A. Update DB
                $participant->update([
                    'last_read_message_id' => $lastMessage->id,
                    'last_read_at' => now() // Nên có thêm trường này để debug thời gian
                ]);

                // B. [QUAN TRỌNG] Bắn Event Real-time để bên kia thấy chữ "Seen" ngay lập tức
                // Bạn có thể dùng Laravel Echo event hoặc logic Whisper như frontend bạn đang làm.
                // Nếu dùng Whisper ở frontend rồi thì đoạn broadcast này có thể bỏ qua để đỡ duplicate logic,
                // nhưng làm ở backend thì chắc chắn hơn (tránh trường hợp user tắt browser nhanh quá).
                
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

    public function updateLastReadMessage(Request $request, Conversation $conversation, Message $message){
        $user = $request->user();
        $conversationId = $conversation->id;
        $messageId = $message->id;
        // Kiểm tra xem người dùng có phải là thành viên của cuộc trò chuyện không
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