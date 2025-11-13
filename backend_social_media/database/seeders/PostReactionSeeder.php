<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Post;
use App\Models\User;

class PostReactionSeeder extends Seeder
{
    public function run(): void
    {
        echo "Seeding Post Reactions...\n";

        $posts = Post::all();
        $users = User::pluck('id');

        if ($posts->isEmpty() || $users->isEmpty()) {
            echo "Posts or users not found! Seed users and posts first.\n";
            return;
        }

        // Các loại reaction bạn muốn
        $reactionTypes = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];

        foreach ($posts as $post) {
            // Số lượng reaction ngẫu nhiên cho mỗi post
            $reactionCount = rand(5, 20);

            // Random user không trùng nhau
            $randomUsers = $users->random(min($reactionCount, $users->count()));

            foreach ($randomUsers as $userId) {
                DB::table('post_reactions')->insert([
                    'post_id'    => $post->id,
                    'user_id'    => $userId,
                    
                    'created_at' => now()->subDays(rand(1, 30))->subMinutes(rand(0, 1440)),
                    'updated_at' => now(),
                ]);
            }
        }

        echo "Total Reactions: " . DB::table('post_reactions')->count() . "\n";
    }
}
