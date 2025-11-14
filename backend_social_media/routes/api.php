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
    Route::post('/posts', [App\Http\Controllers\Api\PostController::class, 'store']);
    // Route::get('/posts/{id}', [App\Http\Controllers\Api\PostController::class, 'show']);
    // Route::put('/posts/{id}', [App\Http\Controllers\Api\PostController::class, 'update']);
    // Route::delete('/posts/{id}', [App\Http\Controllers\Api\PostController::class, 'destroy']);
    // Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
});


// Broadcast::routes(['middleware' => ['auth:sanctum']]);

