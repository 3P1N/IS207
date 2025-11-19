<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class PrivacySettingsTableSeeder extends Seeder
{
    public function run()
    {
        echo "Seeding PrivacySettingsTable...\n";

        $users = User::all();

        foreach ($users as $user) {
            DB::table('privacy_settings')->insert([
                'user_id'      => $user->id,
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
        }

        echo "Privacy settings created: " . DB::table('privacy_settings')->count() . "\n";
    }
}
