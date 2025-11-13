<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class Media extends Model
{
    //
     use HasFactory;
    protected $fillable = [
        'post_id',
        'media_url',
    ];
    public function post(){
        return $this->belongsTo(Post::class); 
    }

}
