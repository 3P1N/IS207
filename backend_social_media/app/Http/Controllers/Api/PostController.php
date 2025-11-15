<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Media;
use App\Http\Controllers\Api\MediaController;



class PostController extends Controller
{
    // public function index(Request $request)
    // {
    //     $user = $request->user();
    //     if (!$user) {
    //         return response()->json([
    //             'message' => 'Unauthorized',
    //         ], 401);
    //     }
    //     // Lấy danh sách bạn bè của user hiện tại
    //     $friends = $user->allFriends();

    //     return response()->json([
    //         'friends' => $friends,
    //     ]);
    // }

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

}