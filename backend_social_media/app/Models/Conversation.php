<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;
    protected $fillable = [
        
        'conversation_id',
        'name'
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
