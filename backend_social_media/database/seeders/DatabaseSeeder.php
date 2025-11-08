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
        \App\Models\User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'role' => \App\Enums\Role::ADMIN,
        ]);

        \App\Models\User::factory(10)->create([
            'role' => \App\Enums\Role::USER,
        ]);
        echo "DatabaseSeeder completed.\n";
        
    }
}
