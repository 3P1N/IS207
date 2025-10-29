"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useChat } from "@/lib/chat-context";
import { ConversationList } from "./conversation-list";
import { ChatWindow } from "./chat-window";
import { Card, CardContent } from "@/components/ui/card";

export function ChatPage() {
  const { currentUser } = useAuth();
  const { conversations } = useChat();
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  if (!currentUser) return null;

  const userConversations = conversations.filter((c) =>
    c.participantIds.includes(currentUser.id)
  );

  const selectedConversation = userConversations.find(
    (c) => c.id === selectedConversationId
  );

  return (
    <div className="flex h-full gap-6 p-6">
      {/* Sidebar: Conversation List */}
      <div className="w-80 flex-shrink-0">
        <ConversationList
          conversations={userConversations}
          selectedId={selectedConversationId}
          onSelect={setSelectedConversationId}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        {selectedConversation ? (
          <ChatWindow conversation={selectedConversation} />
        ) : (
          <Card className="flex h-full items-center justify-center">
            <CardContent className="text-center text-muted-foreground">
              Select a conversation to start chatting
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
