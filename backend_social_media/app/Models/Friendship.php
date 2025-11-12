<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Friendship extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'addressee_id',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function addressee()
    {
        return $this->belongsTo(User::class, 'addressee_id');
    }
    public function scopeBetweenUsers($query, $userA, $userB)
    {
        return $query->where(function ($q) use ($userA, $userB) {
            $q->where('user_id', $userA)->where('addressee_id', $userB);
        })->orWhere(function ($q) use ($userA, $userB) {
            $q->where('user_id', $userB)->where('addressee_id', $userA);
        });
    }
    

}

