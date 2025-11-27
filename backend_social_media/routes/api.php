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
Route::middleware('auth.cookie')->get('/me', fn (Illuminate\Http\Request $r) => $r->user());

//test role middleware
Route::middleware('auth:sanctum')->group(function () {
    Route::middleware('ensureRole:admin')->get('/ping', fn () => response()->json(['message' => 'pong']));
    Route::middleware('ensureRole:user')->get('/pong', fn () => response()->json(['message' => 'ping']));
});

Route::middleware(['auth.cookie','ensureRole:admin'])->prefix('admin')->group(function(){
    Route::get('/users',  [App\Http\Controllers\Api\AdminController::class, 'getUsers']);
    Route::patch('/users/{user}/violated',  [App\Http\Controllers\Api\AdminController::class, 'toggleUsersViolated']);

    Route::get('/posts/violation',  [App\Http\Controllers\Api\AdminController::class, 'getPostsViolation']);
    Route::patch('/posts/{post}/is_visible',  [App\Http\Controllers\Api\AdminController::class, 'togglePostsVisible']);

});

Route::prefix('auth')->group(function () {
    Route::post('/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
    Route::middleware('throttle:10,1')->post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);
    Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
    Route::middleware('auth.cookie')->post('change-password',[App\Http\Controllers\Api\AuthController::class, 'changePassword'] );
    Route::post('/forgot-password', [App\Http\Controllers\Api\AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [App\Http\Controllers\Api\AuthController::class, 'resetPassword']);

});

Route::get('/email/verify/{id}/{hash}', [App\Http\Controllers\Api\VerificationController::class, 'verifyStateless'])
 ->name('verification.verify');


Route::middleware(['auth:sanctum', 'verified.api'])->get('/dashboard', function () {
    return 'Chỉ user đã xác thực email mới vào được';
});

Route::middleware('auth.cookie', 'verified.api')->group(function () {
    Route::get('/friendship/{user}', [App\Http\Controllers\Api\FriendShipController::class, 'getfriend']);
    Route::get('/suggestfriends/{user}', [App\Http\Controllers\Api\FriendShipController::class, 'getsuggest']);
    Route::delete('/friendship/{friendship}', [App\Http\Controllers\Api\FriendShipController::class, 'deletefriendship']);
    Route::post('/friendships', [App\Http\Controllers\Api\FriendShipController::class, 'addfriend']);
    Route::patch('/friendships/{friendship}', [App\Http\Controllers\Api\FriendShipController::class, 'acceptfriend']);
    Route::patch('/userProfile', [App\Http\Controllers\Api\UserController::class, 'updateProfile']);
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
    Route::get('/users/{user}/posts', [App\Http\Controllers\Api\UserController::class, 'getpost']);
    
    Route::get('/users/{user}', [App\Http\Controllers\Api\UserController::class, 'show']);

    Route::get('/users', [App\Http\Controllers\Api\UserController::class, 'index']);
    Route::patch('/users/{id}', [App\Http\Controllers\Api\UserController::class, 'update']);

    Route::post('/posts/{post}/comments', [App\Http\Controllers\Api\CommentController::class, 'store']);
    Route::get('/posts/{post}/comments', [App\Http\Controllers\Api\CommentController::class, 'index']);
    Route::delete('/posts/{post}/comments/{comment}', [App\Http\Controllers\Api\CommentController::class, 'destroy']);
    Route::patch('/posts/{post}/comments/{comment}', [App\Http\Controllers\Api\CommentController::class, 'update']);
    Route::post('/posts/{post}/comments/{comment}/reactions', [App\Http\Controllers\Api\CommentController::class, 'toggleReaction']);
    Route::get('/posts/{post}/comments/{comment}/reactions', [App\Http\Controllers\Api\CommentController::class, 'getCommentReactions']);
    Route::post('/posts/{post}/comments/{comment}/replies', [App\Http\Controllers\Api\CommentController::class, 'replyComment']);


    Route::post('/posts/{post}/reaction',  [App\Http\Controllers\Api\PostReactionController::class, 'toggle']);
    Route::get('/posts/{post}/reactions',  [App\Http\Controllers\Api\PostReactionController::class, 'index']);

    Route::post('/posts/{post}/share',  [App\Http\Controllers\Api\PostShareController::class, 'toggle']);
    Route::get('/posts/{post}/shares',  [App\Http\Controllers\Api\PostShareController::class, 'index']);


});

// Broadcast::routes(['middleware' => ['auth.cookie']]);

// Broadcast::routes(['middleware' => ['auth:sanctum']]);

