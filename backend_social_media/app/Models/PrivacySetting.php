<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrivacySetting extends Model
{
    //
    protected $fillable=[
        'user_id',
        'show_profile',
        'show_posts',
        'show_friends',
        'show_email',
        'show_phone',
    ];

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }

}
