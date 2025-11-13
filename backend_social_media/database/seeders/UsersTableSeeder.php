<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        echo "Seeding users...\n";

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => \App\Enums\Role::ADMIN,
            'avatarUrl' => 'storage/picture.png',
            'gender' => 'male',
        ]);

        User::factory(10)->create([
            'role' => \App\Enums\Role::USER,
        ]);
    }
}
