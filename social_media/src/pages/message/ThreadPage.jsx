import React, { useEffect, useMemo, useContext, useRef, useLayoutEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
// 1. Import hooks
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";

export default function ThreadPage() {
  const { threadId } = useParams();
  const { echoInstance, userData } = useContext(AuthContext);
  const meId = userData ? userData.id : null;
  
  // Dùng queryClient để thao tác trực tiếp vào cache (cho real-time)
  const queryClient = useQueryClient(); 
  
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  // --- 1. FETCH DATA (Query) ---
  const fetchMessages = async ({ queryKey }) => {
    // queryKey là mảng ['messages', threadId], ta lấy phần tử thứ 1
    const [_, id] = queryKey; 
    const response = await api.get(`/conversations/${id}/messages`);
    return response.data;
  };

  const { data: messages = [], isLoading: loadingMessage } = useQuery({
    // QUAN TRỌNG: Key phụ thuộc vào threadId. 
    // Khi threadId đổi -> React Query tự coi là cache mới -> fetch lại.
    queryKey: ["messages", threadId], 
    queryFn: fetchMessages,
    enabled: !!threadId, // Chỉ chạy khi có threadId
    staleTime: Infinity, // Tin nhắn cũ ít khi đổi, để vô hạn cho đỡ fetch lại thừa
    refetchOnWindowFocus: false,
  });

  // --- 2. SEND MESSAGE (Mutation) ---
  const sendMessageMutation = useMutation({
    mutationFn: async (content) => {
      const response = await api.post(`/conversations/${threadId}/messages`, {
        content: content,
      });
      return response.data;
    },
    onSuccess: (newMessage) => {
      // Khi gửi thành công, ta tự cập nhật cache ngay lập tức (Optimistic update kiểu đơn giản)
      // Thay vì gọi fetch lại toàn bộ list (tốn API), ta nối tin nhắn mới vào mảng cũ
      queryClient.setQueryData(["messages", threadId], (oldMessages = []) => {
        return [...oldMessages, newMessage];
      });
    },
  });

  // --- 3. REAL-TIME SUBSCRIPTION (Pusher/Echo) ---
  useEffect(() => {
    if (!echoInstance || !threadId) return;

    const channelName = `chat.${threadId}`;
    const channel = echoInstance.private(channelName);

    const handler = (newMessage) => {
      console.log("📩 Realtime message received:", newMessage);
      
      // KỸ THUẬT QUAN TRỌNG:
      // Update trực tiếp vào Cache của React Query khi có sự kiện từ Pusher
      queryClient.setQueryData(["messages", threadId], (oldMessages = []) => {
        // Kiểm tra xem tin nhắn đã tồn tại chưa (tránh duplicate với mutation ở trên)
        const exists = oldMessages.some(m => m.id === newMessage.id);
        if (exists) return oldMessages;
        
        return [...oldMessages, newMessage];
      });
    };

    // Lắng nghe sự kiện
    channel.listen(".MessageSent", handler);
    channel.listen("MessageSent", handler);

    return () => {
      // Cleanup logic giữ nguyên
      channel.stopListening(".MessageSent");
      channel.stopListening("MessageSent");
      echoInstance.leave(`private-${channelName}`);
    };
  }, [echoInstance, threadId, queryClient]);


  // --- 4. LOGIC SCROLL & NORMALIZE (Giữ nguyên) ---
  const normalizedMessages = useMemo(() => {
    // React Query đảm bảo messages luôn là mảng (nhờ default value ở trên)
    const unique = new Map();
    for (const msg of messages) {
      unique.set(msg.id, msg); 
    }

    return Array.from(unique.values()).map((msg) => ({
      id: msg.id,
      sender: msg.sender,
      content: msg.content,
      mine: msg.sender?.id === meId,
    }));
  }, [messages, meId]);

  const jumpToBottom = () => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  useLayoutEffect(() => {
    if (loadingMessage) return;
    const raf = requestAnimationFrame(() => {
      jumpToBottom();
    });
    return () => cancelAnimationFrame(raf);
  }, [normalizedMessages, loadingMessage]);

  const handleSend = (content) => {
    sendMessageMutation.mutate(content);
  };

  return (
    <Box
      sx={{
        display: "flex", flexDirection: "column", height: "100%", width: "100%",
        bgcolor: "#fafafa", borderRadius: 2, p: 2,
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
          flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1, px: 1,
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: 3 },
        }}
      >
        {loadingMessage ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} /> <Typography ml={1}>Đang tải tin nhắn...</Typography>
          </Box>
        ) : (
          normalizedMessages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        
        {sendMessageMutation.isPending && (
          <Typography variant="body2" sx={{ color: "text.secondary", alignSelf: 'flex-end' }}>
            Đang gửi...
          </Typography>
        )}
        <div ref={bottomRef} />
      </Box>

      {/* Ô nhập chat */}
      <ChatInput onSend={handleSend} disabled={sendMessageMutation.isPending} />
    </Box>
  );
}