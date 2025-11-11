// src/pages/message/ThreadPage.jsx
import React, { useEffect, useState, useMemo, useContext } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";

export default function ThreadPage() {
  const { threadId } = useParams();
  const { token, userData } = useContext(AuthContext);
  const meId = userData ? userData.id : null;
  const [messages, setMessages] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [loadingSendMessage, setLoadingSendMessage] = useState(false);

  useEffect(() => {
    // Lấy tin nhắn khi threadId thay đổi
    if (threadId) {
      getMessages(threadId);
    }
  }, [threadId]);


  // Lấy danh sách tin nhắn từ API
  const getMessages = async (conversationId) => {
    // Gọi API để lấy tin nhắn
    setLoadingMessage(true);
    try {
      const response = await api.get(`/conversations/${conversationId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 thêm token tại đây
        },
      });
      console.log("Fetched messages:", response.data);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessage(false);
    }
  };

  const normalizedMessages = useMemo(() => {
    return messages.map((msg) => ({
      id: msg.id,
      sender: msg.sender,
      content: msg.content,
      mine: msg.sender.id === meId,
    }));
  }, [messages]);


  const handleSend = async (newMessage) => {
    setLoadingSendMessage(true);
    try {
      // Gọi API để gửi tin nhắn
      const response = await api.post(`/conversations/${threadId}/messages`, {
        content: newMessage,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 thêm token tại đây
        },
      });
      console.log("Message sent:", response.data);
      // Cập nhật danh sách tin nhắn với tin nhắn mới

      setMessages((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoadingSendMessage(false);
    }
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
        {loadingMessage ? ( 
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Đang tải tin nhắn...
          </Typography>
        ) : (
          normalizedMessages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
          
        )}
        {loadingSendMessage && (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Đang gửi tin nhắn...
          </Typography>
        )}
      </Box>

      {/* Ô nhập chat */}
      <ChatInput onSend={handleSend} />
    </Box>
  );
}
