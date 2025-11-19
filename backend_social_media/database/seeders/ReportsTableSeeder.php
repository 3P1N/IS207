<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Post;

class ReportsTableSeeder extends Seeder
{
    public function run()
    {
        echo "Seeding ReportsTable...\n";

        $users = User::all();
        $posts = Post::all();

        if ($posts->count() === 0 || $users->count() === 0) {
            echo "No users or posts found. Skip seeding reports.\n";
            return;
        }

        $reasons = [
            'Spam',
            'Harassment',
            'Inappropriate content',
            'Hate speech',
            'Fake information',
            'Other'
        ];

        // Tạo khoảng 100 reports ngẫu nhiên (hoặc ít hơn nếu dữ liệu nhỏ)
        $total = min(100, $users->count() * 2);

        $created = 0;

        for ($i = 0; $i < $total; $i++) {
            $user = $users->random();
            $post = $posts->random();

            // Tránh violation unique constraint
            $exists = DB::table('reports')->where([
                'reporter_id' => $user->id,
                'post_id'     => $post->id,
            ])->exists();

            if ($exists) continue;

            DB::table('reports')->insert([
                'reporter_id' => $user->id,
                'post_id'     => $post->id,
                'reason'      => $reasons[array_rand($reasons)],
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);

            $created++;
        }

        echo "Reports created: $created\n";
    }
}
