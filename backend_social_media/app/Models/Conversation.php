<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    // optional: constants to avoid magic strings in code
    public const TYPE_PRIVATE = 'private';
    public const TYPE_GROUP = 'group';

    protected $fillable = [
        'name',
        'type',
        'avatar_url',
        
    ];

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function participants()
    {
        return $this->hasMany(ConversationParticipant::class);
    }

    public function lastMessage()
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }
}
