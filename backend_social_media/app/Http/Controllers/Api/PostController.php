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
                ->whereNull('deleted_at') 
                ->whereDoesntHave('reports', function($query) use ($userId) {
                $query->where('reporter_id', $userId);
            })
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
        $userId = $user->id;
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        $post = Post::with(['user', 'media', 'comments', 'reactions'])
            ->whereNull('deleted_at') 
            ->whereDoesntHave('reports', function($query) use ($userId) {
                $query->where('reporter_id', $userId);
            })
            ->find($index);
        if(!$post){
            return response()->json(['message' => 'Post not found'], 404);
        }
        return response()->json($post, 201);

    }

    public function update(Request $request, $index){
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }

        $post = Post::with(['user', 'media', 'comments', 'reactions'])
            ->find($index);
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        // Check quyền chỉnh sửa
        if ($post->user->id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }

        // Cập nhật nội dung nếu có
        if ($request->has('content')) {
            $post->content = $request->input('content');
        }

        $post->save();

        // Xử lý media mới (nếu gửi media mới)
       if ($request->has('media_url') && !empty($request->input('media_url'))) {
        // Xóa media cũ
            foreach ($post->media as $media) {
                $media->delete();
            }

            // Thêm media mới
            (new MediaController)->store($request, $post->id);
        }

        // Load lại quan hệ để trả về
        $post->load(['media', 'comments', 'reactions', 'user']);

        return response()->json([
            'message' => 'Post updated successfully',
            'post' => $post
        ], 200);
    }

    public function destroy(Request $request, Post $post){
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        if(!$post){
            return response()->json(['message' => 'Post not found'], 404);
        }
        if ($post->user->id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        $post->delete();

        return response()->json([
            'message' => 'Post deleted successfully'
        ], 200);
    }

}