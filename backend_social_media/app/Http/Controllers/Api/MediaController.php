<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Media;


class MediaController extends Controller
{
   

    public function store(Request $request, $postId){
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        $post = Post::find($postId);
        if (! $post) {
            return response()->json(['message' => 'Post not found'], 404);
        }
        $validated = $request->validate([
            'media_url' => 'required|array',
            'media_url.*' => 'required|url'
        ]);
        
        $created = [];
        foreach ($validated['media_url'] as $url) {
            $media = Media::create([
                'post_id' => $post->id,
                'media_url' => $url,
                // thêm các cột khác nếu model có: type, filename, disk ...
            ]);
            $created[] = $media;
        }

        return response()->json(['message' => 'Media attached', 'media' => $created], 201);
        
    }

}