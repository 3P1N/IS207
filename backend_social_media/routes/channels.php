<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\ConversationParticipant;

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



Broadcast::channel('chat.{conversationId}', function ($user, $conversationId) {
    // Kiểm tra xem người dùng có quyền truy cập kênh chat riêng tư không
    // return true;
    return ConversationParticipant::where('conversation_id', $conversationId)
        ->where('user_id', $user->id)
        ->exists();
});

Route::get('/test-auth', function (Request $request) {
    return response()->json(['user' => $request->user()]);
})->middleware('auth.cookie');
