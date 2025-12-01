import React, { useEffect, useMemo, useContext, useRef, useLayoutEffect, useState } from "react";
import { Box, Typography, CircularProgress, IconButton, Tooltip, ButtonBase } from "@mui/material";
import { useParams } from "react-router-dom";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PersonAdd } from "@mui/icons-material";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";
// import { VideoCallContext } from "../../router/VideoCallProvider"; // Bỏ comment nếu dùng

import ParticipantsModal from "./ParticipantsModal";
import AddMemberModal from "./AddMemberModal";

export default function ThreadPage() {
  const { threadId } = useParams();
  const { echoInstance, userData } = useContext(AuthContext);
  const meId = userData ? userData.id : null;
  const queryClient = useQueryClient();
  const containerRef = useRef(null);
  
  const prevScrollHeightRef = useRef(0);
  const isAutoScrollRef = useRef(true); 

  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  // STATE MỚI: Lưu ID tin nhắn gửi thành công gần nhất của mình
  const [lastSentMessageId, setLastSentMessageId] = useState(null);

  // --- 1. FETCH DATA ---
  const fetchConversation = async ({ pageParam = 1 }) => {
    const response = await api.get(`/conversations/${threadId}/messages?page=${pageParam}`);
    return response.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: loadingMessage
  } = useInfiniteQuery({
    queryKey: ["messages", threadId],
    queryFn: fetchConversation,
    getNextPageParam: (lastPage) => {
      const msgData = lastPage.messages;
      if (msgData.next_page_url) {
        return msgData.current_page + 1;
      }
      return undefined;
    },
    enabled: !!threadId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const conversationInfo = data?.pages?.[0]?.conversation;

  // Lấy toàn bộ message raw từ cache
  const rawMessages = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.messages.data);
  }, [data]);

  const participants = conversationInfo?.participants || [];
  const conversationName = conversationInfo?.name;

  const currentMemberIds = useMemo(() => {
    return participants.map(p => p.user_id);
  }, [participants]);

  const displayInfo = useMemo(() => {
    if (conversationName) return { name: conversationName, isGroup: true };
    const other = participants.find(p => p.user_id !== meId);
    return {
      name: other?.user?.name || "Cuộc trò chuyện",
      isGroup: false,
      avatar: other?.user?.avatarUrl,
      id: other?.user?.id
    };
  }, [conversationName, participants, meId]);

  // --- 2. SCROLL LOGIC ---
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight } = e.target;
    if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      prevScrollHeightRef.current = scrollHeight;
      isAutoScrollRef.current = false;
      fetchNextPage();
    }
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    if (!isAutoScrollRef.current && prevScrollHeightRef.current > 0) {
      const newScrollHeight = containerRef.current.scrollHeight;
      const diff = newScrollHeight - prevScrollHeightRef.current;
      containerRef.current.scrollTop = diff;
      prevScrollHeightRef.current = 0;
    } else if (isAutoScrollRef.current || (!isFetchingNextPage && !prevScrollHeightRef.current)) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [rawMessages, isFetchingNextPage]);

  // --- 3. NORMALIZE DATA (XỬ LÝ TRẠNG THÁI HIỂN THỊ) ---
  const normalizedMessages = useMemo(() => {
    // Reverse để hiển thị cũ -> mới
    const reversed = [...rawMessages].reverse();

    // Lọc trùng (quan trọng khi Optimistic UI thay thế ID tạm bằng ID thật)
    const unique = new Map();
    for (const msg of reversed) unique.set(msg.id, msg);

    return Array.from(unique.values()).map((msg) => {
      let status = null; // null | 'sending' | 'sent' | 'error'

      if (msg.isSending) {
        status = "sending"; // Đang hiển thị từ cache onMutate
      } else if (msg.isError) {
        status = "error";   // Đánh dấu lỗi từ cache onError
      } else if (msg.sender?.id === meId && msg.id === lastSentMessageId) {
        status = "sent";    // Tin nhắn mới nhất đã gửi thành công
      }

      return {
        id: msg.id,
        sender: msg.sender,
        content: msg.content,
        mine: msg.sender?.id === meId,
        status: status, // Truyền prop này vào MessageBubble
        errorMessage: msg.errorMessage // Nếu muốn hiển thị chi tiết lỗi
      };
    });
  }, [rawMessages, meId, lastSentMessageId]);

  // --- 4. SEND MESSAGE (OPTIMISTIC UPDATE) ---
  const sendMessageMutation = useMutation({
    mutationFn: async (content) => {
      const response = await api.post(`/conversations/${threadId}/messages`, { content });
      return response.data;
    },
    // Chạy TRƯỚC khi gửi request
    onMutate: async (content) => {
      await queryClient.cancelQueries(["messages", threadId]);

      const previousData = queryClient.getQueryData(["messages", threadId]);
      
      // Tạo ID tạm thời
      const tempId = `temp-${Date.now()}`;
      
      // Tạo tin nhắn giả
      const optimisticMessage = {
        id: tempId,
        content: content,
        sender: userData, // Giả định gửi từ mình
        created_at: new Date().toISOString(),
        isSending: true, // Cờ đánh dấu đang gửi
        isError: false,
      };

      // Cập nhật Cache ngay lập tức
      queryClient.setQueryData(["messages", threadId], (oldData) => {
        if (!oldData) return oldData;
        const newPages = [...oldData.pages];
        const firstPage = { ...newPages[0] };
        
        // Thêm vào đầu danh sách (vì API sort DESC)
        firstPage.messages = {
          ...firstPage.messages,
          data: [optimisticMessage, ...firstPage.messages.data]
        };
        newPages[0] = firstPage;
        return { ...oldData, pages: newPages };
      });

      // Bật scroll xuống đáy
      isAutoScrollRef.current = true;

      return { previousData, tempId };
    },
    // Chạy khi gửi THÀNH CÔNG
    onSuccess: (newMessage, variables, context) => {
      // Tìm tin nhắn tạm (context.tempId) và thay thế bằng tin thật (newMessage)
      queryClient.setQueryData(["messages", threadId], (oldData) => {
        if (!oldData) return oldData;
        const newPages = [...oldData.pages];
        const firstPage = { ...newPages[0] };
        
        firstPage.messages = {
            ...firstPage.messages,
            // Map qua để thay thế tin nhắn có ID tạm
            data: firstPage.messages.data.map(msg => 
                msg.id === context.tempId ? newMessage : msg
            )
        };
        newPages[0] = firstPage;
        return { ...oldData, pages: newPages };
      });

      // Cập nhật state để hiển thị chữ "Đã gửi" cho tin nhắn này
      setLastSentMessageId(newMessage.id);
    },
    // Chạy khi gửi THẤT BẠI
    onError: (error, variables, context) => {
      // KHÔNG rollback dữ liệu (để giữ tin nhắn lại)
      // Thay vào đó, tìm tin nhắn tạm và đánh dấu lỗi
      queryClient.setQueryData(["messages", threadId], (oldData) => {
        if (!oldData) return oldData;
        const newPages = [...oldData.pages];
        const firstPage = { ...newPages[0] };

        firstPage.messages = {
            ...firstPage.messages,
            data: firstPage.messages.data.map(msg => {
                if (msg.id === context.tempId) {
                    return { 
                        ...msg, 
                        isSending: false, 
                        isError: true, // Cờ báo lỗi
                        errorMessage: "Gửi thất bại" 
                    }; 
                }
                return msg;
            })
        };
        newPages[0] = firstPage;
        return { ...oldData, pages: newPages };
      });
    },
  });

  // --- REAL-TIME UPDATES ---
  // Hàm helper cập nhật tin nhắn realtime từ người KHÁC
  const updateMessagesCache = (newMessage) => {
    queryClient.setQueryData(["messages", threadId], (oldData) => {
      if (!oldData) return oldData;
      
      const newPages = [...oldData.pages];
      const firstPage = { ...newPages[0] };
      
      // Check trùng: Nếu tin nhắn đã tồn tại (do Optimistic Update đã xử lý tin của mình rồi) thì bỏ qua
      // Hoặc nếu echo bắn về tin của chính mình -> bỏ qua
      if (firstPage.messages.data.some(m => m.id === newMessage.id)) return oldData;

      firstPage.messages = {
          ...firstPage.messages,
          data: [newMessage, ...firstPage.messages.data]
      };
      
      newPages[0] = firstPage;
      return { ...oldData, pages: newPages };
    });
  };

  useEffect(() => {
    if (!echoInstance || !threadId) return;
    const channelName = `chat.${threadId}`;
    const channel = echoInstance.private(channelName);

    const handler = (newMessage) => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
        isAutoScrollRef.current = isAtBottom;
      }
      // Nếu tin nhắn từ Echo là của mình (check sender id), ta có thể bỏ qua
      // vì onSuccess đã xử lý việc thay thế ID tạm bằng ID thật rồi.
      if (newMessage.sender_id !== meId) {
          updateMessagesCache(newMessage);
      }
    };

    channel.listen(".MessageSent", handler);
    channel.listen("MessageSent", handler);

    return () => {
      channel.stopListening(".MessageSent");
      channel.stopListening("MessageSent");
      echoInstance.leave(`private-${channelName}`);
    };
  }, [echoInstance, threadId, queryClient, meId]);

  // --- 5. AUTO-FILL ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container || loadingMessage) return;
    const hasNoScrollbar = container.scrollHeight <= container.clientHeight;
    if (hasNoScrollbar && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [normalizedMessages, hasNextPage, isFetchingNextPage, loadingMessage]);

  const handleSend = (content) => sendMessageMutation.mutate(content);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", bgcolor: "#fafafa", borderRadius: 2, p: 2 }}>

        {/* --- HEADER (Giữ nguyên) --- */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', pb: 1 }}>
          <ButtonBase onClick={() => setIsParticipantsOpen(true)} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderRadius: 1, p: 0.5, px: 1, '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } }}>
            <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 'bold' }}>
              {displayInfo.name}
            </Typography>
            {displayInfo.isGroup && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {participants.length} thành viên • Nhấn để xem chi tiết
              </Typography>
            )}
          </ButtonBase>
          <Box>
            {displayInfo.isGroup && (
              <Tooltip title="Thêm người vào nhóm">
                <IconButton color="primary" onClick={() => setIsAddMemberOpen(true)}>
                  <PersonAdd />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* --- MESSAGES LIST --- */}
        <Box
          ref={containerRef}
          onScroll={handleScroll}
          sx={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            px: 1,
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: 3 }
          }}
        >
          {isFetchingNextPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
              <CircularProgress size={20} />
            </Box>
          )}

          {loadingMessage && !data ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} /> <Typography ml={1}>Đang tải tin nhắn...</Typography>
            </Box>
          ) : normalizedMessages.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Chưa có tin nhắn nào
              </Typography>
            </Box>
          ) : (
            // Truyền msg đã có status (sending/sent/error) vào component
            normalizedMessages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
            ))
          )}
          
          {/* Đã xóa phần "Đang gửi..." ở đây vì nó đã được tích hợp vào MessageBubble */}
        </Box>

        {/* --- CHAT INPUT --- */}
        {/* Disable khi mutation đang pending là không cần thiết nữa vì ta muốn UX mượt, 
            nhưng nếu muốn chặn spam thì có thể giữ. Ở đây tôi bỏ disabled để trải nghiệm nhanh hơn */}
        <ChatInput onSend={handleSend} disabled={false} />
      </Box>

      {/* --- MODALS --- */}
      <ParticipantsModal open={isParticipantsOpen} onClose={() => setIsParticipantsOpen(false)} participants={participants} />
      <AddMemberModal open={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} threadId={threadId} currentMemberIds={currentMemberIds} />
    </>
  );
}