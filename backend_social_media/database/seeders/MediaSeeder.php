<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Post;

class MediaSeeder extends Seeder
{
    public function run(): void
    {
        echo "Seeding Media...\n";

        $posts = Post::all();

        if ($posts->isEmpty()) {
            echo "No posts found! Seed posts first.\n";
            return;
        }

        foreach ($posts as $post) {

            // Random 0–3 media cho mỗi post
            $mediaCount = rand(0, 3);

            for ($i = 0; $i < $mediaCount; $i++) {

                // Fake URL ảnh (bạn có thể thay bằng storage thật)
                $fakeImageUrl = "https://picsum.photos/seed/" . uniqid() . "/800/600";

                DB::table('media')->insert([
                    'post_id'    => $post->id,
                    'media_url'  => $fakeImageUrl,
                    'created_at' => now()->subDays(rand(1, 30))->subMinutes(rand(0, 1440)),
                    'updated_at' => now(),
                ]);
            }
        }

        echo "Total Media: " . DB::table('media')->count() . "\n";
    }
}
