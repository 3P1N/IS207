"use client";

import { createContext, useContext, useState, useCallback } from "react";

const ChatContext = createContext(undefined);

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([
    {
      id: "1",
      participantIds: ["2", "3"],
      participantNames: ["john_doe", "jane_smith"],
      participantAvatars: ["/john-avatar.jpg", "/jane-avatar.jpg"],
      messages: [
        {
          id: "1",
          senderId: "2",
          senderName: "john_doe",
          senderAvatar: "/john-avatar.jpg",
          content: "Hey! How are you doing?",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: "2",
          senderId: "3",
          senderName: "jane_smith",
          senderAvatar: "/jane-avatar.jpg",
          content: "I am doing great! Just finished a design project.",
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        },
      ],
    },
  ]);

  const startConversation = useCallback(
    (userId1, userId2, name1, name2, avatar1, avatar2) => {
      const existingConversation = conversations.find(
        (c) =>
          (c.participantIds[0] === userId1 && c.participantIds[1] === userId2) ||
          (c.participantIds[0] === userId2 && c.participantIds[1] === userId1)
      );

      if (existingConversation) {
        return existingConversation.id;
      }

      const newConversation = {
        id: String(conversations.length + 1),
        participantIds: [userId1, userId2],
        participantNames: [name1, name2],
        participantAvatars: [avatar1, avatar2],
        messages: [],
      };

      setConversations((prev) => [...prev, newConversation]);
      return newConversation.id;
    },
    [conversations]
  );

  const sendMessage = useCallback(
    (conversationId, senderId, senderName, senderAvatar, content) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            const newMessage = {
              id: String(c.messages.length + 1),
              senderId,
              senderName,
              senderAvatar,
              content,
              timestamp: new Date(),
            };
            return {
              ...c,
              messages: [...c.messages, newMessage],
              lastMessage: newMessage,
            };
          }
          return c;
        })
      );
    },
    []
  );

  const deleteMessage = useCallback((conversationId, messageId) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            messages: c.messages.filter((m) => m.id !== messageId),
          };
        }
        return c;
      })
    );
  }, []);

  const deleteConversation = useCallback((conversationId) => {
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
  }, []);

  const getConversation = useCallback(
    (conversationId) => conversations.find((c) => c.id === conversationId),
    [conversations]
  );

  return (
    <ChatContext.Provider
      value={{
        conversations,
        startConversation,
        sendMessage,
        deleteMessage,
        deleteConversation,
        getConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
