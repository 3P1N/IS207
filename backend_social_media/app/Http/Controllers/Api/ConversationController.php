<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\ConversationParticipant;

use App\Models\User;

class ConversationController extends Controller
{
    public function index(Request $request)
    {
        $requester = $request->user();
        
        // Lấy danh sách cuộc trò chuyện của user hiện tại
        $conversations = $requester->conversations()->with('participants.user')->get();
        return response()->json($conversations,200);
    }
    public function store(Request $request){
        $name = $request->name;
        $requester= $request->user();
        if(!$name){
            return response()->json(['message'=>'Name is required'], 422);
        }
        $users =$request->users;
        if(!$users){
            return response()->json(['message'=>'You have no participants yet!'], 422);
        }
        $conversation = Conversation::create(['name'=>$name]);
        foreach ($users as $key => $id) {
            # code...
            ConversationParticipant::create([
                'conversation_id'=>$conversation->id,
                'user_id'=>$id
            ]);
        }
         ConversationParticipant::create([
                'conversation_id'=>$conversation->id,
                'user_id'=>$requester->id
            ]);
        $conversation->load('participants');
        return response()->json($conversation, 201);
    }

    public function addParticipant(Request $request, Conversation $conversation){
        $requester = $request->user();
        $participant_ids= $request->participant_ids;

        $isParticipant = ConversationParticipant::where('conversation_id', $conversation->id)
            ->where('user_id', $requester->id)
            ->exists();
        if(!$isParticipant){
            return response()->json(['message'=>'Forbidden'],403);
        }
        if(!$participant_ids){
            return response()->json(['message'=>'Choose at least 1 participant'],422);
        }

        foreach ($participant_ids as $key => $id) {
            ConversationParticipant::create([
                'conversation_id'=>$conversation->id,
                'user_id'=>$id
            ]);
        }
        return response()->json(['message'=>'Add member successfully'],201);
 
    }
}