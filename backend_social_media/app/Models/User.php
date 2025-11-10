<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enums\Role;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Enums\FriendshipStatus;
use App\Models\Friendship;

class User extends Authenticatable
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
        ->withPivot(['status','created_at','updated_at'])
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
        ->withPivot(['status','created_at','updated_at'])
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
}
