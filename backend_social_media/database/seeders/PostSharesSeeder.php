<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Post;

class PostSharesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        echo "Seeding PostShares...\n";

        $users = User::all();
        $posts = Post::all();

        if ($posts->count() === 0 || $users->count() === 0) {
            echo "No users or posts found. Skip seeding shares.\n";
            return;
        }

        // Số lượng shares muốn tạo
        $total = min(100, $users->count() * 2);

        $created = 0;

        for ($i = 0; $i < $total; $i++) {
            $user = $users->random();
            $post = $posts->random();

            // Tránh vi phạm unique(user_id, post_id)
            $exists = DB::table('post_shares')->where([
                'user_id' => $user->id,
                'post_id' => $post->id,
            ])->exists();

            if ($exists) continue;

            DB::table('post_shares')->insert([
                'user_id'    => $user->id,
                'post_id'    => $post->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $created++;
        }

        echo "PostShares created: $created\n";
    }
}
