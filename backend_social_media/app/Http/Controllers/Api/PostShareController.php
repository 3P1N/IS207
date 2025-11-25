<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Post;
use App\Models\PostShare;


class PostShareController extends Controller
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

        $postShares = PostShare::where('post_id', $post->id)
                                    ->with('user')
                                    ->get();
        
        return response()->json($postShares,200);
    }
    
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

        $postShares = PostShare::where('post_id', $post->id)
                                    ->where('user_id', $user->id)
                                    ->first();

        if(!$postShares){
            $postShares = PostShare::create([
                'user_id' => $user->id,
                'post_id' => $post->id,
            ]);
            return response()->json($postShares,201);

        }
        $postShares->delete();
        return response()->json(['message' => 'PostShare deleted successfully'], 200);
        
    }

}