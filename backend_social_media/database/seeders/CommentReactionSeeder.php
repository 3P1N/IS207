<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Comment;
use App\Models\User;
class CommentReactionSeeder extends Seeder
{
    
    public function run(): void
    {
        echo "Seeding Post Reactions...\n";

        $comments = Comment::all();
        $users = User::pluck('id');

        if ($comments->isEmpty() || $users->isEmpty()) {
            echo "Posts or users not found! Seed users and posts first.\n";
            return;
        }

        // Các loại reaction bạn muốn
        $reactionTypes = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];

        foreach ($comments as $comment) {
            // Số lượng reaction ngẫu nhiên cho mỗi post
            $reactionCount = rand(5, 20);

            // Random user không trùng nhau
            $randomUsers = $users->random(min($reactionCount, $users->count()));

            foreach ($randomUsers as $userId) {
                DB::table('comment_reactions')->insert([
                    'comment_id'    => $comment->id,
                    'user_id'    => $userId,
                    
                    'created_at' => now()->subDays(rand(1, 30))->subMinutes(rand(0, 1440)),
                    'updated_at' => now(),
                ]);
            }
        }

        echo "Total Reactions: " . DB::table('comment_reactions')->count() . "\n";
    }
}
