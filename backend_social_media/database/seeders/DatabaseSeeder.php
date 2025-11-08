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
        this->call([
            UsersTableSeeder::class,
            
            FriendshipsTableSeeder::class,
            // ConversationsTableSeeder::class,
            // ConversationParticipantsTableSeeder::class,
            // MessagesTableSeeder::class,
        ]);
        echo "DatabaseSeeder completed.\n";
        
    }
}
