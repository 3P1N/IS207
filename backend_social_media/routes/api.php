<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::middleware('auth:sanctum')->get('/me', fn (Illuminate\Http\Request $r) => $r->user());
Route::middleware('auth:sanctum')->get('/user', fn (Illuminate\Http\Request $r) => $r->user());

//test role middleware
Route::middleware('auth:sanctum')->group(function () {
    Route::middleware('ensureRole:admin')->get('/ping', fn () => response()->json(['message' => 'pong']));
    Route::middleware('ensureRole:user')->get('/pong', fn () => response()->json(['message' => 'ping']));
});

Route::prefix('auth')->group(function () {
    // Route::post('/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
    Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);
    // Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/friends', [App\Http\Controllers\Api\FriendController::class, 'index']);
    Route::get('/conversations', [App\Http\Controllers\Api\ConversationController::class, 'index']);
    Route::get('/conversations/{id}/messages', [App\Http\Controllers\Api\MessageController::class, 'index']);
    Route::post('/conversations/{id}/messages', [App\Http\Controllers\Api\MessageController::class, 'store']);
    // Route::get('/users', [App\Http\Controllers\Api\UserController::class, 'index']);
    // Route::get('/posts', [App\Http\Controllers\Api\PostController::class, 'index']);
    // Route::post('/posts', [App\Http\Controllers\Api\PostController::class, 'store']);
    // Route::get('/posts/{id}', [App\Http\Controllers\Api\PostController::class, 'show']);
    // Route::put('/posts/{id}', [App\Http\Controllers\Api\PostController::class, 'update']);
    // Route::delete('/posts/{id}', [App\Http\Controllers\Api\PostController::class, 'destroy']);
    // Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
});
Route::post('/debug/broadcast-auth', function (Request $request) {
    // Log để bạn xem server thực sự nhận gì
    Log::debug('DEBUG broadcast auth headers', $request->headers->all());
    Log::debug('DEBUG broadcast auth body', $request->all());
    Log::debug('DEBUG broadcast auth user', ['user' => $request->user() ? $request->user()->only('id','email') : null]);

    // Gọi logic autent của Laravel — trả kết quả trực tiếp
    // WARNING: Broadcast::auth() sẽ return Response|array etc.
    $response = Broadcast::auth($request);

    // Nếu trả về Response instance, convert sang JSON/raw để nhìn rõ
    if ($response instanceof \Illuminate\Http\Response || $response instanceof \Symfony\Component\HttpFoundation\Response) {
        $content = $response->getContent();
        Log::debug('DEBUG broadcast auth response raw', ['content' => $content]);
        return response($content, $response->getStatusCode())->withHeaders($response->headers->all());
    }

    // Nếu là array, return JSON
    return response()->json($response);
})->middleware('auth:sanctum');

Route::post('/debug/broadcast-auth2', function (Request $request) {
    Log::debug('DBG headers', $request->headers->all());
    Log::debug('DBG body', $request->all());
    Log::debug('DBG user', ['user' => $request->user()?->only('id','email')]);

    $response = Broadcast::auth($request);

    Log::debug('DBG Broadcast::auth return type', ['type' => gettype($response)]);
    if ($response instanceof \Illuminate\Http\Response || $response instanceof \Symfony\Component\HttpFoundation\Response) {
        Log::debug('DBG Broadcast::auth response content', ['content' => $response->getContent()]);
        return response($response->getContent(), $response->getStatusCode())
               ->withHeaders($response->headers->all());
    }

    // If array or string
    Log::debug('DBG Broadcast::auth response raw', ['response' => $response]);
    return response()->json($response);
})->middleware('auth:sanctum');

// Broadcast::routes(['middleware' => ['auth:sanctum']]);

