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
        $comment = Comment::where('post_id', $post->id)->with('user')->orderBy('created_at', 'desc')->get();
        return response()->json($comment,200);
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
    public function destroy(Request $request,Post $post, Comment $comment){
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        if(!$post){
            return response()->json(['message' => 'Post not found'], 404);
        }
        if(!$comment){
            return response()->json(['message' => 'Comment not found'], 404);
        }
        if($comment->user_id !== $user->id){
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $comment->delete();
        return response()->json(['message'=>'Comment deleted successfully'], 200);
    }
    public function update(Request $request,Post $post, Comment $comment){
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        if(!$post){
            return response()->json(['message' => 'Post not found'], 404);
        }
        if(!$comment){
            return response()->json(['message' => 'Comment not found'], 404);
        }
        if($comment->user_id !== $user->id){
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $comment->update(['content'=>$request->content]);
        return response()->json($comment, 200);
    }
}