<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Conversation;
use App\Models\User;

class MessagesTableSeeder extends Seeder
{
    public function run(): void
    {
        echo "Seeding MessagesTable...\n";

        $conversations = Conversation::all();

        foreach ($conversations as $conversation) {
            // Lấy những người trong conversation
            $participants = DB::table('conversation_participants')
                ->where('conversation_id', $conversation->id)
                ->pluck('user_id');

            if ($participants->count() < 2) continue; // bỏ qua nếu ít người

            // Tạo ngẫu nhiên 5–10 tin nhắn
            $messageCount = rand(5, 10);
            for ($i = 0; $i < $messageCount; $i++) {
                DB::table('messages')->insert([
                    'conversation_id' => $conversation->id,
                    'sender_id' => $participants->random(),
                    'content' => fake()->sentence(rand(4, 10)),
                    'created_at' => now()->subMinutes(rand(1, 1000)),
                    'updated_at' => now(),
                ]);
            }
        }

        echo "Messages created: " . DB::table('messages')->count() . "\n";
    }
}
