"use client";

import { useAuth } from "@/lib/auth-context";
import { useChat } from "@/lib/chat-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Trash2 } from "lucide-react";

export function FriendsTab() {
  const { currentUser, users, updateUser } = useAuth();
  const { startConversation } = useChat();

  if (!currentUser) return null;

  const friends = users.filter((u) => currentUser.friends.includes(u.id));

  const handleRemoveFriend = (friendId) => {
    const newFriends = currentUser.friends.filter((id) => id !== friendId);
    updateUser(currentUser.id, { friends: newFriends });

    const friend = users.find((u) => u.id === friendId);
    if (friend) {
      const friendNewFriends = friend.friends.filter(
        (id) => id !== currentUser.id
      );
      updateUser(friendId, { friends: friendNewFriends });
    }
  };

  const handleStartChat = (friendId) => {
    const friend = users.find((u) => u.id === friendId);
    if (friend) {
      startConversation(
        currentUser.id,
        friendId,
        currentUser.username,
        friend.username,
        currentUser.avatar,
        friend.avatar
      );
    }
  };

  return (
    <div className="space-y-4">
      {friends.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            You don't have any friends yet. Start discovering!
          </CardContent>
        </Card>
      ) : (
        friends.map((friend) => (
          <Card key={friend.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {friend.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{friend.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {friend.bio || "No bio"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStartChat(friend.id)}
                  className="gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveFriend(friend.id)}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
