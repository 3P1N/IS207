// src/pages/message/ThreadPage.jsx
import React, { useEffect, useState, useMemo, useContext, useRef, useLayoutEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";
import { createEcho } from "../../shared/echo";
import Pusher from "pusher-js";

export default function ThreadPage() {
  const { threadId } = useParams();
  const { echoInstance, token, userData } = useContext(AuthContext);
  const meId = userData ? userData.id : null;
  const [messages, setMessages] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [loadingSendMessage, setLoadingSendMessage] = useState(false);
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!echoInstance) return; // đợi echo sẵn sàng
    console.log("🔌 subscribe effect mount", threadId);

    const channelName = `chat.${threadId}`;
    let channel = null;

    try {
      channel = echoInstance.private(channelName);
    } catch (err) {
      console.error("Echo private subscribe error:", err);
      // nếu không subscribe được thì thoát sớm
      return;
    }

    const handler = (e) => {
      console.log("payload (.MessageSent):", e);
      setMessages((prev) => [...prev, e]);
    };

    // đăng ký cả 2 dạng tên event nếu backend dùng dot hoặc không
    try { channel.listen(".MessageSent", handler); } catch (e) { /* ignore */ }
    try { channel.listen("MessageSent", handler); } catch (e) { /* ignore */ }

    return () => {
      try {
        console.log("🧹 unsubscribing", channelName);

        // nếu có API stopListening trên channel
        if (channel && typeof channel.stopListening === "function") {
          try {
            channel.stopListening(".MessageSent");
            channel.stopListening("MessageSent");
          } catch (err) {
            console.warn("stopListening failed", err);
          }
        }

        // unbind underlying pusher channel (nếu có)
        try {
          const pusher = echoInstance?.connector?.pusher;
          const pusherChannel = pusher?.channel?.(`private-${channelName}`) || pusher?.channel?.(`private-${channelName}`);
          if (pusherChannel && typeof pusherChannel.unbind_all === "function") {
            pusherChannel.unbind_all();
          }
        } catch (err) {
          // không bắt buộc — chỉ cố gắng dọn dẹp
        }

        // leave channel bằng API echo (thử nhiều cách an toàn)
        if (echoInstance && typeof echoInstance.leave === "function") {
          try { echoInstance.leave(`private-${channelName}`); } catch (e) { /* ignore */ }
        } else if (channel && typeof channel.leave === "function") {
          try { channel.leave(); } catch (e) { /* ignore */ }
        }
      } catch (err) {
        console.warn("cleanup error", err);
      }
    };
  }, [echoInstance, threadId]);


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
      // console.log("Message sent:", response.data);
      // Cập nhật danh sách tin nhắn với tin nhắn mới

      setMessages((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoadingSendMessage(false);
    }
  };

  const normalizedMessages = useMemo(() => {
    const unique = new Map();
    for (const msg of messages) {
      unique.set(msg.id, msg); // Nếu trùng id, sẽ ghi đè, giữ bản cuối
    }

    return Array.from(unique.values()).map((msg) => ({
      id: msg.id,
      sender: msg.sender,
      content: msg.content,
      mine: msg.sender.id === meId,
    }));
  }, [messages, meId]);


  // Hàm nhảy ngay (no smooth)
  const jumpToBottom = () => {
    const el = containerRef.current;
    if (!el) return;
    // Option A: set scrollTop trực tiếp (reliable, immediate)
    el.scrollTop = el.scrollHeight;
    // Option B: bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  };

  // Dùng useLayoutEffect để nhảy trước paint khi normalizedMessages cập nhật
  useLayoutEffect(() => {
    // Nếu đang loading thì chờ loadingMessage false (tránh nhảy sớm)
    if (loadingMessage) return;
    // đảm bảo DOM đã render: dùng requestAnimationFrame để an toàn với ảnh/media
    const raf = requestAnimationFrame(() => {
      jumpToBottom();
    });
    return () => cancelAnimationFrame(raf);
  }, [normalizedMessages, loadingMessage]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
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
      ref={containerRef}
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
        <div ref={bottomRef} />
      </Box>

      {/* Ô nhập chat */}
      <ChatInput onSend={handleSend} />
    </Box>
  );
}
