<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use App\Models\Message;
use App\Models\User;
use App\Models\ConversationParticipant;

class MessageRead implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public ConversationParticipant $participant)
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            //Channel sẽ tự thêm tiền tố "private-" vào tên kênh
            new PrivateChannel('chat.' . $this->participant->conversation_id),
        ];
    }
    public function broadcastAs(): string
    {
        return 'MessageRead';
    }
    public function broadcastWith(): array
    {
        return $this->participant->toArray();
    }
}
