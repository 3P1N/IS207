<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class BlockSeeder extends Seeder
{
    public function run(): void
    {
        echo "Seeding Blocks...\n";

        $users = User::pluck('id');

        if ($users->count() < 2) {
            echo "Not enough users to create blocks.\n";
            return;
        }

        // Danh sách unique pair để tránh bị trùng
        $existingPairs = [];

        foreach ($users as $blocker) {

            // Mỗi user block 1–5 user random
            $blockCount = rand(1, 5);

            // Các user có thể bị block
            $others = $users->filter(fn($id) => $id !== $blocker); // không block chính mình
            $randomBlocked = $others->random(min($blockCount, $others->count()));

            foreach ($randomBlocked as $blocked) {

                // Tạo key duy nhất để tránh duplicate
                $pairKey = "{$blocker}_{$blocked}";
                if (isset($existingPairs[$pairKey])) continue;

                // Lưu để tránh trùng
                $existingPairs[$pairKey] = true;

                DB::table('blocks')->insert([
                    'blocker_id' => $blocker,
                    'blocked_id' => $blocked,
                    'created_at' => now()->subDays(rand(1, 30)),
                    'updated_at' => now(),
                ]);
            }
        }

        echo "Total Blocks: " . DB::table('blocks')->count() . "\n";
    }
}
