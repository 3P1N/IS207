<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'reporter_id',
        'post_id',
        'reason',
        'content_reason',
    ];

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id');
    }
}
