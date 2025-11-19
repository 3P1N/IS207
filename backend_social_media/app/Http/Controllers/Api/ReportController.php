<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Report;


class ReportController extends Controller
{
    public function store(Request $request, Post $post){
         $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        if(!$post){
            return response()->json(['message' => 'Post not found'], 404);

        }

        $report = Report::create([
            'reporter_id' => $user->id,
            'post_id' => $post->id
        ]);
        return response()->json($report, 201);

    }
}