<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Post;
use App\Models\User;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        echo "Seeding Comments...\n";

        $posts = Post::all();
        $users = User::pluck('id');

        if ($posts->isEmpty() || $users->isEmpty()) {
            echo "No posts or users found! Seed users and posts first.\n";
            return;
        }

        $total = 0;

        foreach ($posts as $post) {
            // Số comment ngẫu nhiên cho mỗi post
            $count = rand(1, 10);

            // Mảng lưu id comment đã tạo của post này để làm parent
            $createdCommentIds = [];

            for ($i = 0; $i < $count; $i++) {
                // Random user
                $userId = $users->random();

                // 30% chance comment là reply -> chọn parent id ngẫu nhiên từ $createdCommentIds
                $parentId = null;
                if (!empty($createdCommentIds) && rand(1, 100) <= 30) {
                    $parentId = $createdCommentIds[array_rand($createdCommentIds)];
                }

                $id = DB::table('comments')->insertGetId([
                    'post_id'            => $post->id,
                    'user_id'            => $userId,
                    'content'            => fake()->sentences(rand(1,3), true),
                    'parent_comment_id'  => $parentId,
                    'created_at'         => now()->subDays(rand(0, 30))->subMinutes(rand(0, 1440)),
                    'updated_at'         => now(),
                ]);

                $createdCommentIds[] = $id;
                $total++;
            }
        }

        echo "Total Comments: {$total}\n";
    }
}
