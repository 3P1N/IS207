<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\User;

class ConversationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        // Lấy danh sách cuộc trò chuyện của user hiện tại
        $conversations = $user->conversations()->with('participants.user')->get();
        return response()->json($conversations);
    }
}