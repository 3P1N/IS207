<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enums\Role;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\MustVerifyEmail; 
use Illuminate\Support\Facades\Password;
use App\Enums\FriendshipStatus;
use App\Models\Friendship;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatarUrl',
        'gender',
        'is_Violated',

    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        // 'role' => Role::class,
    ];
    public function isAdmin(): bool
    {
        return $this->role === Role::ADMIN;
    }
    public function isUser(): bool
    {
        return $this->role === Role::USER;
    }
    public function sentFriendRequests()
    {
        return $this->hasMany(Friendship::class, 'user_id');
    }
    public function receivedFriendRequests()
    {
        return $this->hasMany(Friendship::class, 'addressee_id');
    }
    public function friends()
    {
        return $this->belongsToMany(
            User::class,
            'friendships',
            'user_id',
            'addressee_id'
        )
        ->wherePivot('status', FriendshipStatus::ACCEPTED)
        ->withPivot(['id','status','created_at','updated_at'])
        ->withTimestamps();
    }

    // Quan hệ bạn bè khi $this là người được nhận (chiều ngược lại)
    public function friendsOf()
    {
        return $this->belongsToMany(
            User::class,
            'friendships',
            'addressee_id',
            'user_id'
        )
        ->wherePivot('status', FriendshipStatus::ACCEPTED)
        ->withPivot(['id','status','created_at','updated_at'])
        ->withTimestamps();
    }
    public function friendss()
    {
        return $this->belongsToMany(
            User::class,
            'friendships',
            'user_id',
            'addressee_id'
        )
        ->withPivot(['id','status','created_at','updated_at'])
        ->withTimestamps();
    }
    public function friendsOfs()
    {
        return $this->belongsToMany(
            User::class,
            'friendships',
            'addressee_id',
            'user_id'
        )
        ->withPivot(['id','status','created_at','updated_at'])
        ->withTimestamps();
    }

    // Helper: trả về đầy đủ bạn bè từ cả 2 chiều (Collection)
    public function allFriends()
    {
        return $this->friends()->get()
            ->merge($this->friendsOf()->get())
            ->unique('id')
            ->values();
    }
    public function allFriendss()
    {
        return $this->friends()->get()
            ->merge($this->friendsOfs()->get())
            ->unique('id')
            ->values();
    }
    public function friendships()
    {
        return $this->hasMany(Friendship::class, 'user_id')
                    ->orWhere('addressee_id', $this->id);
    }
    public function allFriendsIds()
    {
        // id friend mình đã add (mình là user_id)
        $ids = $this->friendss()->pluck('users.id');

        // id friend đã add mình (mình là addressee_id)
        $ids = $ids->merge(
            $this->friendsOfs()->pluck('users.id')
        );

        // loại trùng + thêm luôn id của chính mình để exclude
        return $ids->push($this->id)
                ->unique()
                ->values();
    }
    public function getSuggestFriends()
    {
        // Lấy danh sách id cần loại (bạn bè đã accepted + chính mình)
        $excludeIds = $this->allFriendsIds();

        // Gợi ý các user chưa phải bạn & không phải mình
        $friend = User::whereNotIn('id', $excludeIds)
            ->inRandomOrder()  // cho random cho giống social
            ->limit(10)        // giới hạn 10 người
            ->get();

        return $friend;
    }
    // Trong User model
    public function conversations()
    {
        return $this->belongsToMany(Conversation::class, 'conversation_participants', 'user_id', 'conversation_id');
    }
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
    public function postReactions()
    {
        return $this->hasMany(PostReaction::class);
    }
    public function commentReactions()
    {
        return $this->hasMany(CommentReaction::class);
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function blocks()
    {
        return $this->hasMany(Block::class, 'blocker_id');
    }
    public function blockedBy()
    {
        return $this->hasMany(Block::class, 'blocked_id');
    }
    public function privacy()
    {
        return $this->hasOne(PrivacySetting::class);
    }
    public function reportsMade()
    {
        return $this->hasMany(\App\Models\Report::class, 'reporter_id');
    }
    public function sharesMade()
    {
        return $this->hasMany(\App\Models\PostShare::class, 'user_id');
    }
    public function sendResetPasswordMail()
    {
        $token = Password::createToken($this);

        $resetUrl = "http://localhost:5173/reset-password?token={$token}&email={$this->email}";

        \Mail::send('emails.reset-password',['url' => $resetUrl, 'user' => $this], function ($message) {
            $message->to($this->email)
                    ->subject('Reset your password');
        });
    }

}
