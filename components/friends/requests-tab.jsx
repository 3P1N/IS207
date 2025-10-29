"use client";

import { useAuth } from "@/lib/auth-context";
import { useFriend } from "@/lib/friend-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X } from "lucide-react";

export function RequestsTab() {
  const { currentUser, users, updateUser } = useAuth();
  const { friendRequests, acceptFriendRequest, rejectFriendRequest } =
    useFriend();

  if (!currentUser) return null;

  const incomingRequests = friendRequests.filter(
    (r) => r.toUserId === currentUser.id && r.status === "pending"
  );

  const handleAccept = (requestId, fromUserId) => {
    acceptFriendRequest(requestId, fromUserId, currentUser.id);

    const newFriends = [...currentUser.friends, fromUserId];
    updateUser(currentUser.id, { friends: newFriends });

    const fromUser = users.find((u) => u.id === fromUserId);
    if (fromUser) {
      const fromUserNewFriends = [...fromUser.friends, currentUser.id];
      updateUser(fromUserId, { friends: fromUserNewFriends });
    }
  };

  const handleReject = (requestId) => {
    rejectFriendRequest(requestId);
  };

  return (
    <div className="space-y-4">
      {incomingRequests.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No pending friend requests
          </CardContent>
        </Card>
      ) : (
        incomingRequests.map((request) => (
          <Card key={request.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={request.fromAvatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {request.fromUsername[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{request.fromUsername}</p>
                  <p className="text-xs text-muted-foreground">
                    Sent {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleAccept(request.id, request.fromUserId)}
                  className="gap-2"
                >
                  <Check className="h-4 w-4" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReject(request.id)}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
