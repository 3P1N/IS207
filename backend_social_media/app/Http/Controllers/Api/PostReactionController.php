<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Post;
use App\Models\Comment;
use App\Models\PostReaction;


class PostReactionController extends Controller
{
    public function toggle(Request $request, Post $post)
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

        $postReaction = PostReaction::where('post_id', $post->id)
                                    ->where('user_id', $user->id)
                                    ->first();

        if(!$postReaction){
            $postReaction = PostReaction::create([
                'user_id' => $user->id,
                'post_id' => $post->id,
            ]);
            return response()->json(['post_reaction'=>$postReaction],201);

        }
        $postReaction->delete();
        return response()->json(['message' => 'PostReaction deleted successfully'], 200);
        
    }

}