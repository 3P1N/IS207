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

//test role middleware
Route::middleware('auth:sanctum')->group(function () {
    Route::middleware('ensureRole:admin')->get('/ping', fn () => response()->json(['message' => 'pong']));
    Route::middleware('ensureRole:user')->get('/pong', fn () => response()->json(['message' => 'ping']));
});

Route::prefix('auth')->group(function () {
    Route::post('/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
    Route::middleware('throttle:10,1')->post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);
    // Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
});

Route::get('/email/verify/{id}/{hash}', [App\Http\Controllers\Api\VerificationController::class, 'verifyStateless'])
 ->name('verification.verify');


Route::middleware(['auth:sanctum', 'verified.api'])->get('/dashboard', function () {
    return 'Chỉ user đã xác thực email mới vào được';
});

Route::middleware('auth:sanctum', 'verified.api')->group(function () {
    Route::get('/friends', [App\Http\Controllers\Api\FriendController::class, 'index']);
    Route::get('/conversations', [App\Http\Controllers\Api\ConversationController::class, 'index']);
    Route::get('/conversations/{id}/messages', [App\Http\Controllers\Api\MessageController::class, 'index']);
    Route::post('/conversations/{id}/messages', [App\Http\Controllers\Api\MessageController::class, 'store']);
    // Route::get('/users', [App\Http\Controllers\Api\UserController::class, 'index']);
    Route::get('/posts', [App\Http\Controllers\Api\PostController::class, 'index']);
    Route::post('/posts', [App\Http\Controllers\Api\PostController::class, 'store']);
    Route::post('/posts/{id}/media', [App\Http\Controllers\Api\MediaController::class, 'store']);
    Route::get('/posts/{id}', [App\Http\Controllers\Api\PostController::class, 'show']);
    Route::put('/posts/{id}', [App\Http\Controllers\Api\PostController::class, 'update']);
    Route::post('/posts/{post}/report', [App\Http\Controllers\Api\ReportController::class, 'store']);
    Route::delete('/posts/{post}', [App\Http\Controllers\Api\PostController::class, 'destroy']);

    // Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);  
    Route::get('/users/{id}', [App\Http\Controllers\Api\UserController::class, 'show']);
    Route::get('/users', [App\Http\Controllers\Api\UserController::class, 'index']);
    Route::post('/posts/{post}/comments', [App\Http\Controllers\Api\CommentController::class, 'store']);
    Route::get('/posts/{post}/comments', [App\Http\Controllers\Api\CommentController::class, 'index']);
    Route::delete('/posts/{post}/comments/{comment}', [App\Http\Controllers\Api\CommentController::class, 'destroy']);
    Route::patch('/posts/{post}/comments/{comment}', [App\Http\Controllers\Api\CommentController::class, 'update']);

    Route::post('/posts/{post}/reaction',  [App\Http\Controllers\Api\PostReactionController::class, 'toggle']);

});


// Broadcast::routes(['middleware' => ['auth:sanctum']]);

