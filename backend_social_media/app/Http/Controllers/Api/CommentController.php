<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Post;
use App\Models\Comment;

class CommentController extends Controller
{
    public function index(Request $request, Post $post)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        
        if(!$post){
            return response()->json(['message' => 'Post not found'], 404);
        }
        $comment = Comment::where('post_id', $post->id)->with('user')->get();
        return response()->json($comment,201);
    }
    public function store(Request $request, Post $post)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        
        if(!$post){
            return response()->json(['message' => 'Post not found'], 404);
        }
        $comment = Comment::create([
            'content' => $request->content,
            'user_id' => $user->id,
            'post_id' => $post->id,
        ]);
        $comment->load('user');
        return response()->json(['comment'=>$comment],201);
    }
}