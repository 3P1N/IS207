import React, { useEffect, useMemo, useContext, useRef, useLayoutEffect, useState } from "react";
import { Box, Typography, CircularProgress, IconButton, Tooltip, ButtonBase } from "@mui/material"; // Thêm ButtonBase
import { useParams } from "react-router-dom";
import { PersonAdd, Info } from "@mui/icons-material"; // Import icon
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";

// Import 2 modal mới
import ParticipantsModal from "./ParticipantsModal";
import AddMemberModal from "./AddMemberModal";

export default function ThreadPage() {
  const { threadId } = useParams();
  const { echoInstance, userData } = useContext(AuthContext);
  const meId = userData ? userData.id : null;
  const queryClient = useQueryClient();
  
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  // --- State cho Modals ---
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  // --- 1. FETCH DATA ---
  const fetchConversation = async ({ queryKey }) => {
    const [_, id] = queryKey;
    const response = await api.get(`/conversations/${id}/messages`);
    return response.data;
  };

  const { data: conversationData, isLoading: loadingMessage } = useQuery({
    queryKey: ["messages", threadId],
    queryFn: fetchConversation,
    enabled: !!threadId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const messages = conversationData?.messages || [];
  const participants = conversationData?.participants || [];
  const conversationName = conversationData?.name;

  // Lấy danh sách ID các user đang trong nhóm để truyền vào modal thêm (để lọc)
  const currentMemberIds = useMemo(() => {
      return participants.map(p => p.user_id);
  }, [participants]);

  const displayInfo = useMemo(() => {
    if (conversationName) return { name: conversationName, isGroup: true };
    const other = participants.find(p => p.user_id !== meId);
    return {
        name: other?.user?.name || "Cuộc trò chuyện",
        isGroup: false, // Nếu không có tên nhóm, tạm coi là chat 1-1 hoặc nhóm chưa đặt tên
        avatar: other?.user?.avatarUrl
    };
  }, [conversationName, participants, meId]);

  // --- 2. SEND MESSAGE ---
  const sendMessageMutation = useMutation({
    mutationFn: async (content) => {
      const response = await api.post(`/conversations/${threadId}/messages`, { content });
      return response.data;
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData(["messages", threadId], (oldData) => {
        if (!oldData) return oldData;
        return { ...oldData, messages: [...oldData.messages, newMessage] };
      });
    },
  });

  // --- 3. REAL-TIME ---
  useEffect(() => {
    if (!echoInstance || !threadId) return;
    const channelName = `chat.${threadId}`;
    const channel = echoInstance.private(channelName);

    const handler = (newMessage) => {
      queryClient.setQueryData(["messages", threadId], (oldData) => {
        if (!oldData) return undefined;
        const exists = oldData.messages.some(m => m.id === newMessage.id);
        if (exists) return oldData;
        return { ...oldData, messages: [...oldData.messages, newMessage] };
      });
    };

    channel.listen(".MessageSent", handler);
    channel.listen("MessageSent", handler);

    return () => {
      channel.stopListening(".MessageSent");
      channel.stopListening("MessageSent");
      echoInstance.leave(`private-${channelName}`);
    };
  }, [echoInstance, threadId, queryClient]);

  // --- 4. SCROLL & NORMALIZE ---
  const normalizedMessages = useMemo(() => {
    const unique = new Map();
    for (const msg of messages) unique.set(msg.id, msg);
    return Array.from(unique.values()).map((msg) => ({
      id: msg.id, sender: msg.sender, content: msg.content, mine: msg.sender?.id === meId,
    }));
  }, [messages, meId]);

  const jumpToBottom = () => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  };

  useLayoutEffect(() => {
    if (loadingMessage) return;
    const raf = requestAnimationFrame(() => jumpToBottom());
    return () => cancelAnimationFrame(raf);
  }, [normalizedMessages, loadingMessage]);

  const handleSend = (content) => sendMessageMutation.mutate(content);

  return (
    <>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", bgcolor: "#fafafa", borderRadius: 2, p: 2 }}>
        
        {/* --- HEADER --- */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', pb: 1 }}>
            
            {/* Khu vực Click để xem thông tin */}
            <ButtonBase 
                onClick={() => setIsParticipantsOpen(true)}
                sx={{ 
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', 
                    borderRadius: 1, p: 0.5, px: 1,
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                }}
            >
                <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 'bold' }}>
                    {displayInfo.name}
                </Typography>
                {displayInfo.isGroup && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {participants.length} thành viên • Nhấn để xem chi tiết
                    </Typography>
                )}
            </ButtonBase>

            {/* Nút thêm thành viên (Chỉ hiện nếu là Group) */}
            {displayInfo.isGroup && (
                <Tooltip title="Thêm người vào nhóm">
                    <IconButton color="primary" onClick={() => setIsAddMemberOpen(true)}>
                        <PersonAdd />
                    </IconButton>
                </Tooltip>
            )}
        </Box>

        {/* --- MESSAGES LIST --- */}
        <Box ref={containerRef} sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1, px: 1, "&::-webkit-scrollbar": { width: 6 }, "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: 3 } }}>
            {loadingMessage ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} /> <Typography ml={1}>Đang tải tin nhắn...</Typography>
            </Box>
            ) : (
            normalizedMessages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
            )}
            {sendMessageMutation.isPending && <Typography variant="body2" sx={{ color: "text.secondary", alignSelf: 'flex-end' }}>Đang gửi...</Typography>}
            <div ref={bottomRef} />
        </Box>

        {/* --- CHAT INPUT --- */}
        <ChatInput onSend={handleSend} disabled={sendMessageMutation.isPending} />
        </Box>

        {/* --- MODALS --- */}
        <ParticipantsModal 
            open={isParticipantsOpen} 
            onClose={() => setIsParticipantsOpen(false)} 
            participants={participants} 
        />
        
        <AddMemberModal 
            open={isAddMemberOpen} 
            onClose={() => setIsAddMemberOpen(false)} 
            threadId={threadId}
            currentMemberIds={currentMemberIds}
        />
    </>
  );
}