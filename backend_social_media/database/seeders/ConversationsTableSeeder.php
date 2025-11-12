<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Conversation;
use App\Models\User;
class ConversationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        echo "Seeding ConversationsTable...\n";

        $users = User::all();

        // Tạo 10 cuộc hội thoại ngẫu nhiên
        for ($i = 1; $i <= 10; $i++) {
            Conversation::create([
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        echo "Conversations created: " . Conversation::count() . "\n";
    }
}
