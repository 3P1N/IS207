"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useFriend } from "@/lib/friend-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserPlus, UserCheck } from "lucide-react";

export function DiscoverTab() {
  const { currentUser, users } = useAuth();
  const { friendRequests, sendFriendRequest } = useFriend();
  const [searchQuery, setSearchQuery] = useState("");

  if (!currentUser) return null;

  const filteredUsers = users.filter((u) => {
    if (u.id === currentUser.id) return false;
    if (currentUser.friends.includes(u.id)) return false;

    const lowerQuery = searchQuery.toLowerCase();
    return (
      u.username.toLowerCase().includes(lowerQuery) ||
      u.email.toLowerCase().includes(lowerQuery)
    );
  });

  const handleSendRequest = (userId) => {
    const existingRequest = friendRequests.find(
      (r) =>
        r.fromUserId === currentUser.id &&
        r.toUserId === userId &&
        r.status === "pending"
    );

    if (!existingRequest) {
      sendFriendRequest(
        currentUser.id,
        currentUser.username,
        userId,
        currentUser.avatar
      );
    }
  };

  const hasPendingRequest = (userId) => {
    return friendRequests.some(
      (r) =>
        r.fromUserId === currentUser.id &&
        r.toUserId === userId &&
        r.status === "pending"
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by username or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            {searchQuery ? "No users found" : "No more users to discover"}
          </CardContent>
        </Card>
      ) : (
        filteredUsers.map((user) => {
          const hasPending = hasPendingRequest(user.id);

          return (
            <Card key={user.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.bio || "No bio"}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => handleSendRequest(user.id)}
                  disabled={hasPending}
                  className="gap-2"
                >
                  {hasPending ? (
                    <>
                      <UserCheck className="h-4 w-4" />
                      Requested
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Add Friend
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
