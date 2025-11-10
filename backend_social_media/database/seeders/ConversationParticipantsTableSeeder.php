<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Conversation;
use App\Models\User;
use Illuminate\Support\Facades\DB;
class ConversationParticipantsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        
        echo "Seeding ConversationParticipantsTable...\n";

        $users = User::all();
        $conversations = Conversation::all();

        foreach ($conversations as $conversation) {
            // Mỗi conversation có 2–4 người tham gia ngẫu nhiên
            $participants = $users->random(rand(2, min(4, $users->count())));

            foreach ($participants as $user) {
                DB::table('conversation_participants')->insert([
                    'conversation_id' => $conversation->id,
                    'user_id' => $user->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        echo "Conversation participants created: " . DB::table('conversation_participants')->count() . "\n";
    }
}
