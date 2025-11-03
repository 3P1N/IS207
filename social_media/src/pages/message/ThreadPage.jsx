// src/pages/message/ThreadPage.jsx
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

export default function ThreadPage() {
  const { threadId } = useParams();

  // Tin nhắn demo
  const [messages, setMessages] = useState([
    { id: 1, sender: "Nguyễn Văn A", text: "Chào bạn!", mine: false },
    { id: 2, sender: "Tôi", text: "Xin chào! 😊", mine: true },
  ]);

  const handleSend = (newMessage) => {
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: "Tôi", text: newMessage, mine: true },
    ]);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "#fafafa",
        borderRadius: 2,
        p: 2,
      }}
    >
      {/* Header */}
      <Typography variant="h6" sx={{ mb: 1, color: "primary.main" }}>
        💬 Cuộc trò chuyện #{threadId}
      </Typography>

      {/* Danh sách tin nhắn */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          px: 1,
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: 3,
          },
        }}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </Box>

      {/* Ô nhập chat */}
      <ChatInput onSend={handleSend} />
    </Box>
  );
}
