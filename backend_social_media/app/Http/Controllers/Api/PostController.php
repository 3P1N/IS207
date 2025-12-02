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
                ->simplePaginate(10);

        return response()->json($posts, 200);
    }


    public function store(Request $request){
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // 1. Validate dữ liệu
        $validated = $request->validate([
            'content'   => 'nullable|string',        // Cho phép null (nếu chỉ đăng ảnh)
            'media_url' => 'nullable|array',         // Phải là mảng (vì frontend gửi mảng urls)
            'media_url.*' => 'string',               // Các phần tử trong mảng phải là chuỗi (URL)
        ]);

        // 2. Kiểm tra logic: Phải có ít nhất Content HOẶC Media
        // Nếu cả 2 đều trống thì báo lỗi
        $hasContent = !empty($request->input('content'));
        $hasMedia   = !empty($request->input('media_url')) && count($request->input('media_url')) > 0;

        if (!$hasContent && !$hasMedia) {
            return response()->json([
                'message' => 'Bạn phải nhập nội dung hoặc chọn ảnh/video'
            ], 422);
        }

        // 3. Tạo Post
        $post = Post::create([
            'user_id' => $user->id,
            'content' => $request->input('content'), // Nếu null thì lưu null (DB cột content phải allow NULL)
        ]);

       
        if ($hasMedia) {
            // Lưu ý: Đảm bảo hàm store bên MediaController xử lý được mảng media_url từ $request
            (new MediaController)->store($request, $post->id);
        }

        // 5. Load quan hệ để trả về frontend hiển thị ngay
        $post->load('media', 'user');

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
        $post = Post:: 
            whereDoesntHave('reports', function($query) use ($userId) {
                $query->where('reporter_id', $userId);
            })
            ->with(['user', 'media'])
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
            ->withCount(['reactions', 'comments', 'shares'])
            ->find($index);
        if(!$post){
            return response()->json(['message' => 'Post not found'], 404);
        }
        return response()->json($post, 200);

    }

    public function update(Request $request, $id) { 
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // 1. Tìm bài viết
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        // 2. Check quyền chỉnh sửa
        if ($post->user_id !== $user->id) { // Dùng user_id so sánh nhanh hơn gọi quan hệ $post->user->id
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // 3. Validate dữ liệu
        $request->validate([
            'content' => 'nullable|string',
            'media_url' => 'nullable|array',
            'media_url.*' => 'string',
        ]);

        // 4. KIỂM TRA LOGIC: KHÔNG ĐƯỢC ĐỂ POST RỖNG
        // Lấy nội dung dự kiến sau khi update
        // Nếu request có gửi content thì lấy content mới, không thì lấy content cũ
        $newContent = $request->has('content') ? $request->input('content') : $post->content;
        
        // Nếu request có gửi media_url thì đếm số lượng mới, không thì đếm số lượng cũ
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

        // 5. Cập nhật nội dung
        if ($request->has('content')) {
            $post->content = $request->input('content');
        }
        
        $post->save();

        // 6. Xử lý Media
        // Chỉ xử lý khi key 'media_url' tồn tại trong request (kể cả mảng rỗng)
        if ($request->has('media_url')) {
            // B1: Xóa toàn bộ media cũ của post này
            // Dùng each->delete() để đảm bảo kích hoạt event xóa file (nếu bạn có cài đặt trong Model Media)
            $post->media()->each(function($media) {
                $media->delete();
            });

            // B2: Thêm media mới (nếu mảng không rỗng)
            $newMediaUrls = $request->input('media_url');
            if (!empty($newMediaUrls) && is_array($newMediaUrls)) {
                (new MediaController)->store($request, $post->id);
            }
        }

        // 7. Load lại quan hệ để trả về frontend cập nhật UI ngay lập tức
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