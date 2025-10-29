"use client";

import { useRef, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useChat } from "@/lib/chat-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Send, Trash2, MoreVertical, Blocks as Block } from "lucide-react";

export function ChatWindow({ conversation }) {
  const { currentUser, updateUser, users } = useAuth();
  const { sendMessage, deleteMessage, deleteConversation } = useChat();
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);

  if (!currentUser) return null;

  const otherParticipantIndex =
    conversation.participantIds[0] === currentUser.id ? 1 : 0;
  const otherParticipantId = conversation.participantIds[otherParticipantIndex];
  const otherParticipantName =
    conversation.participantNames[otherParticipantIndex];
  const otherParticipantAvatar =
    conversation.participantAvatars[otherParticipantIndex];

  const otherUser = users.find((u) => u.id === otherParticipantId);
  const isUserBlocked = currentUser.blockedUsers.includes(otherParticipantId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    sendMessage(
      conversation.id,
      currentUser.id,
      currentUser.username,
      currentUser.avatar,
      messageText
    );
    setMessageText("");
  };

  const handleBlockUser = () => {
    const newBlockedUsers = isUserBlocked
      ? currentUser.blockedUsers.filter((id) => id !== otherParticipantId)
      : [...currentUser.blockedUsers, otherParticipantId];

    updateUser(currentUser.id, { blockedUsers: newBlockedUsers });
  };

  const handleDeleteMessage = (messageId) => {
    deleteMessage(conversation.id, messageId);
  };

  const handleDeleteConversation = () => {
    deleteConversation(conversation.id);
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={otherParticipantAvatar || "/placeholder.svg"} />
            <AvatarFallback>
              {otherParticipantName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{otherParticipantName}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {otherUser?.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleBlockUser}>
              <Block className="mr-2 h-4 w-4" />
              {isUserBlocked ? "Unblock" : "Block"} User
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteConversation}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-4 py-4">
        {isUserBlocked && (
          <div className="rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">
            You have blocked this user. Unblock to send messages.
          </div>
        )}

        {conversation.messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.senderId === currentUser.id ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.senderAvatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {message.senderName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div
                className={`flex flex-col gap-1 ${
                  message.senderId === currentUser.id
                    ? "items-end"
                    : "items-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.senderId === currentUser.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {message.senderId === currentUser.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMessage(message.id)}
                      className="h-auto p-0 text-xs text-destructive"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            placeholder={
              isUserBlocked
                ? "You have blocked this user"
                : "Type a message..."
            }
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isUserBlocked) {
                handleSendMessage();
              }
            }}
            disabled={isUserBlocked}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || isUserBlocked}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
