"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export function ConversationList({ conversations, selectedId, onSelect }) {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  if (!currentUser) return null;

  const filteredConversations = conversations.filter((c) => {
    const otherParticipantName =
      c.participantIds[0] === currentUser.id
        ? c.participantNames[1]
        : c.participantNames[0];
    return otherParticipantName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-sm text-muted-foreground">
              No conversations yet
            </CardContent>
          </Card>
        ) : (
          filteredConversations.map((conversation) => {
            const otherParticipantIndex =
              conversation.participantIds[0] === currentUser.id ? 1 : 0;
            const otherParticipantName =
              conversation.participantNames[otherParticipantIndex];
            const otherParticipantAvatar =
              conversation.participantAvatars[otherParticipantIndex];

            return (
              <Button
                key={conversation.id}
                variant={selectedId === conversation.id ? "default" : "outline"}
                className="h-auto w-full justify-start gap-3 p-3"
                onClick={() => onSelect(conversation.id)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={otherParticipantAvatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {otherParticipantName[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="font-semibold">{otherParticipantName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {conversation.lastMessage?.content || "No messages yet"}
                  </p>
                </div>
              </Button>
            );
          })
        )}
      </div>
    </div>
  );
}
