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

        $reason = $request->reason;

        $report = Report::create([
            'reporter_id' => $user->id,
            'post_id' => $post->id,
            'reason' => $reason
        ]);
        return response()->json($report, 201);

    }
}