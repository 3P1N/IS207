<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Media;
use App\Models\PostReaction;
use App\Models\Comment;
use App\Http\Controllers\Api\MediaController;



class PostController extends Controller
{

    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }

        $userId = $user->id;

        $posts = Post::where('is_visible', true)
            ->withCount(['reactions', 'comments'])
            ->with(['user', 'media'])
            ->withExists([
                'reactions as is_liked' => function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                }
            ])
            ->orderBy('created_at', 'desc')
            ->simplePaginate(10);

        return response()->json($posts, 200);
    }


    public function store(Request $request){
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        $post = Post::create([
            'user_id' => $user->id,
            'content' => $request->input('content'),
            
        ]);

        (new MediaController)->store($request, $post->id);

        $post->load('media');

        return response()->json($post, 201);
    }

    public function show(Request $request, $index){
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        $post = Post::with(['user', 'media', 'comments', 'reactions'])
            ->find($index);
        if(!$post){
            return response()->json(['message' => 'Post not found'], 404);

        }
        return response()->json($post, 201);

    }

}