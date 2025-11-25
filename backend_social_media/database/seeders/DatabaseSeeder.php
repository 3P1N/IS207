<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        echo "Running DatabaseSeeder...\n";
        $this->call([
            UsersTableSeeder::class,
            
            FriendshipsTableSeeder::class,
            ConversationsTableSeeder::class,
            ConversationParticipantsTableSeeder::class,
            MessagesTableSeeder::class,
            PostSeeder::class,
            MediaSeeder::class,
            CommentSeeder::class,
            PostSharesSeeder::class,
            CommentReactionSeeder::class,
            PostReactionSeeder::class,
            BlockSeeder::class,
            PrivacySettingsTableSeeder::class,
            ReportsTableSeeder::class,
            
        ]);
        echo "DatabaseSeeder completed.\n";
        
    }
}
