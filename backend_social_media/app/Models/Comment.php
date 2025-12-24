<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Comment extends Model
{
    //
    use HasFactory;
    protected $fillable = [
        'post_id',
        'user_id',
        'content',
        'parent_comment_id',
    ];
    protected $appends = ['is_liked'];

    public function getIsLikedAttribute()
    {
        $userId = auth()->id();
        if (!$userId) return false;

        return $this->reactions()->where('user_id', $userId)->exists();
    }

    public function post(){
        return $this->belongsTo(Post::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
    public function parentComment(){
        return $this->belongsTo(Comment::class, 'parent_comment_id');
    }

    public function childComments(){
        return $this->hasMany(Comment::class, 'parent_comment_id');
    }
    public function childrenRecursive()
    {
        return $this->childComments()
            ->with(['user', 'childrenRecursive', 'reactions']) 
            ->withCount('reactions'); 
    }
    public function reactions()
    {
        return $this->hasMany(CommentReaction::class);
    }   
}
