<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\User;
use Illuminate\Http\Request;
/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});



Broadcast::channel('chat', function ($user) {
    // Kiểm tra xem người dùng có quyền truy cập kênh chat riêng tư không
    return true; // Chỉ cho phép người dùng đã xác thực
});

Route::get('/test-auth', function (Request $request) {
    return response()->json(['user' => $request->user()]);
})->middleware('auth:sanctum');
