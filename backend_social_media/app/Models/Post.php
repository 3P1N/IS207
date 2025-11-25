<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    //
     use HasFactory, SoftDeletes;
    protected $fillable = [
        'user_id',
        'content',
        'is_visible',
        // 'media_urls',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function reactions()
    {
        return $this->hasMany(PostReaction::class);
    }   
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function media()
    {
        return $this->hasMany(Media::class);
    }
    public function reports()
    {
        return $this->hasMany(Report::class, 'post_id');
    }
    public function shares()
    {
        return $this->hasMany(PostShare::class, 'post_id');
    }
}
