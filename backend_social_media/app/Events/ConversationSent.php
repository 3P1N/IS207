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

class ConversationSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public array $participantIds;
    /**
     * Create a new event instance.
     */
    public function __construct(public Message $message, array $participantIds)
    {
        //
        $this->participantIds = $participantIds;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return array_map(fn($id) => new PrivateChannel('conversations.' . $id), $this->participantIds);
    }
    public function broadcastAs(): string
    {
        return 'MessageSent';
    }
    public function broadcastWith(): array
    {
        return [
            'message' => $this->message->toArray(),
            'conversation_id' => $this->message->conversation_id,
            'sender_id' => $this->message->sender_id,
            'sent_at' => $this->message->created_at?->toDateTimeString(),
        ];
    }
}
