<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Media;
use App\Models\PostReaction;
use App\Models\Comment;
use App\Http\Controllers\Api\MediaController;
use App\Enums\Role;


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
        $keyword = trim($request->query('search', ''));
        
        $posts = Post::where('is_visible', true)
                ->whereNull('deleted_at') 
                ->whereDoesntHave('reports', function($query) use ($userId) {
                    $query->where('reporter_id', $userId);
                })
                ->when(!empty($keyword), function($q) use ($keyword) {
                    $q->where('content', 'like', "%{$keyword}%");
                })
                ->withCount(['reactions', 'comments', 'shares'])
                ->with([
                'user',
                'media',
                
                ])
                ->withExists([
                    'reactions as is_liked' => function ($q) use ($userId) {
                        $q->where('user_id', $userId);
                    }
                ])
                ->withExists([
                    'shares as is_shared' => function ($q) use ($userId) {
                        $q->where('user_id', $userId);
                    }
                ])
                ->orderBy('created_at', 'desc')
                ->cursorPaginate(10);

        return response()->json($posts, 200);
    }


    public function store(Request $request){
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Validate dữ liệu
        $validated = $request->validate([
            'content'   => 'nullable|string',       
            'media_url' => 'nullable|array',        
            'media_url.*' => 'string',               
        ]);

        $hasContent = !empty($request->input('content'));
        $hasMedia   = !empty($request->input('media_url')) && count($request->input('media_url')) > 0;

        if (!$hasContent && !$hasMedia) {
            return response()->json([
                'message' => 'Bạn phải nhập nội dung hoặc chọn ảnh/video'
            ], 422);
        }

        
        $post = Post::create([
            'user_id' => $user->id,
            'content' => $request->input('content'),
        ]);

       
        if ($hasMedia) {
            
            (new MediaController)->store($request, $post->id);
        }

        $post->load('media', 'user');

        return response()->json($post, 201);
    }

    public function show(Request $request, $index)
    {
        $user = $request->user();
        $userId = $user?->id; 

       
        $query = Post::with(['user', 'media'])
                    ->withCount(['reactions', 'comments', 'shares']);

        if ($userId) {
            $query->withExists([
                'reactions as is_liked' => function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                }
            ])->withExists([
                'shares as is_shared' => function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                }
            ]);
        }

        $post = $query->find($index);

        if (! $post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        // Kiểm tra xem user hiện tại đã report bài này chưa
        $isReportedByCurrentUser = $userId
            ? $post->reports()->where('reporter_id', $userId)->exists()
            : false;

        // Nếu đã report và user không phải admin => trả 404 
        if ($isReportedByCurrentUser && (! $user || $user->role !== Role::ADMIN)) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        return response()->json($post, 200);
    }


    public function update(Request $request, $id) { 
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

       
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        // Check quyền chỉnh sửa
        if ($post->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Validate dữ liệu
        $request->validate([
            'content' => 'nullable|string',
            'media_url' => 'nullable|array',
            'media_url.*' => 'string',
        ]);

        // Không được rỗng
       
        $newContent = $request->has('content') ? $request->input('content') : $post->content;
        
        $newMediaCount = 0;
        if ($request->has('media_url')) {
            $dataMedia = $request->input('media_url');
            $newMediaCount = is_array($dataMedia) ? count($dataMedia) : 0;
        } else {
            $newMediaCount = $post->media()->count();
        }

        // Nếu cả content rỗng VÀ media rỗng -> Báo lỗi
        if (empty($newContent) && $newMediaCount === 0) {
            return response()->json([
                'message' => 'Bài viết không được để trống hoàn toàn (cần có nội dung hoặc ảnh/video).'
            ], 422);
        }

        //Cập nhật nội dung
        if ($request->has('content')) {
            $post->content = $request->input('content');
        }
        
        $post->save();

        
        if ($request->has('media_url')) {
           
            $post->media()->each(function($media) {
                $media->delete();
            });

            $newMediaUrls = $request->input('media_url');
            if (!empty($newMediaUrls) && is_array($newMediaUrls)) {
                (new MediaController)->store($request, $post->id);
            }
        }

        $post->load(['media', 'user', 'comments', 'reactions']);

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