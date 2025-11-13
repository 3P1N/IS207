<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class PostReaction extends Model
{
    //
    use HasFactory;
    protected $fillable = [
        'post_id',
        'user_id',
        // 'reaction_type',
    ];
    public function post()
    {
        return $this->belongsTo(Post::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
