<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Post;

use Illuminate\Http\Request;
use App\Enums\Role;
class AdminController extends Controller{
  
    public function getUsers(Request $request){
        $user = $request->user();
        if(!$user){
            return response()->json(['message' => "Unauthorize"], 401);
        }
        if($user->role !== Role::ADMIN){
            return response()->json(['message' => "Forbidden"], 403);            
        }
    
        $users = User::where('role',Role::USER)->get();

        return response()->json($users, 200); 
    }

    public function toggleUsersViolated(Request $request, User $user){
        $admin = $request->user();
        if(!$admin){
            return response()->json(['message' => "Unauthorize"], 401);
        }
        if($admin->role !== Role::ADMIN){
            return response()->json(['message' => "Forbidden"], 403);            
        }
        if($user->role === Role::ADMIN){
            return response()->json(['message'=>"Cannot change violated status of admin user"], 400);
        }
        if(!$user){
            return response()->json(['message'=>"User not found"], 404);
        }
        $isViolated = $user->is_violated;
        $user->update([
            'is_Violated'=> !$user->is_Violated,
        ]);
        if (!$isViolated) {
            
            $updateData['disable_at'] = now();
        }
        return response()->json(['message'=>'Update user successfull','user'=> $user], 200); 
    }


    public function getPostsViolation(Request $request){
         $user = $request->user();
        if(!$user){
            return response()->json(['message' => "Unauthorize"], 401);
        }
        if($user->role !== Role::ADMIN){
            return response()->json(['message' => "Forbidden"], 403);            
        }
        $posts = Post::whereHas('reports')
                ->withCount('reports')
                ->with('user')
                ->get();
        return response()->json($posts, 200); 
    }
    public function togglePostsVisible(Request $request, Post $post){
        $admin = $request->user();
        if(!$admin){
            return response()->json(['message' => "Unauthorize"], 401);
        }
        if($admin->role !== Role::ADMIN){
            return response()->json(['message' => "Forbidden"], 403);            
        }
        if(!$post){
            return response()->json(['message'=>"Post not found"], 404);
        }
        
        $post->update(['is_visible'=> !$post->is_visible]);
        return response()->json(['message'=>'Update post is_visible successfull'], 200); 
    }

}
