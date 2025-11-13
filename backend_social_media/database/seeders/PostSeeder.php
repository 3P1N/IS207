<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        echo "Seeding Posts...\n";

        $users = User::all();

        if ($users->count() === 0) {
            echo "No users found! Please seed users first.\n";
            return;
        }

        foreach ($users as $user) {

            // Mỗi user có 3–7 bài post
            $postCount = rand(3, 7);

            for ($i = 0; $i < $postCount; $i++) {

                DB::table('posts')->insert([
                    'user_id'    => $user->id,
                    'content'    => fake()->paragraph(rand(2, 5)),
                    'is_visible' => fake()->boolean(90), // 90% là visible
                    'is_reported'=> fake()->boolean(5),  // 5% là reported
                   
                    'created_at' => now()->subDays(rand(1, 30))->subMinutes(rand(0, 1440)),
                    'updated_at' => now(),
                ]);
            }
        }

        echo "Total Posts: ".DB::table('posts')->count()."\n";
    }
}
