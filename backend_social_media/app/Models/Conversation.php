<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'conversation_id',
    ];
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
    public function participants()
    {
        return $this->hasMany(ConversationParticipant::class);
    }
    
}
