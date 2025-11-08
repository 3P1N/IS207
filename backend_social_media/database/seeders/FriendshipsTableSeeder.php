<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FriendshipsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        echo "Seeding FriendshipsTable...\n";
        // Lấy tất cả users
        $users = \App\Models\User::all();

        // Tạo các mối quan hệ bạn bè ngẫu nhiên
        foreach ($users as $user) {
            // Chọn ngẫu nhiên một số user khác để kết bạn
            $friends = $users->where('id', '!=', $user->id)->random(rand(1, 5));
            foreach ($friends as $friend) {
                // Kiểm tra nếu chưa có mối quan hệ bạn bè
                $exists = \DB::table('friendships')
                    ->where(function ($query) use ($user, $friend) {
                        $query->where('user_id', $user->id)
                              ->where('addressee_id', $friend->id);
                    })
                    ->orWhere(function ($query) use ($user, $friend) {
                        $query->where('user_id', $friend->id)
                              ->where('addressee_id', $user->id);
                    })
                    ->exists();

                if (!$exists) {
                    // Tạo mối quan hệ bạn bè với trạng thái 'accepted'
                    \DB::table('friendships')->insert([
                        'user_id' => $user->id,
                        'addressee_id' => $friend->id,
                        'status' => 'accepted',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
