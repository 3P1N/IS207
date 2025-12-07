import React, { useEffect, useMemo, useContext, useRef, useLayoutEffect, useState } from "react";
import { Box, Typography, CircularProgress, IconButton, Tooltip, ButtonBase } from "@mui/material";
import { useParams } from "react-router-dom";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PersonAdd } from "@mui/icons-material";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { AuthContext } from "../../router/AuthProvider";
import { useNavigate } from "react-router-dom";
import { api } from "../../shared/api";
// import { VideoCallContext } from "../../router/VideoCallProvider"; 
import NotFoundPage from "../not-found/NotFoundPage";
import ParticipantsModal from "./ParticipantsModal";
import AddMemberModal from "./AddMemberModal";
import { ArrowBack } from "@mui/icons-material";

export default function ThreadPage() {
  const { threadId } = useParams();
  const { echoInstance, userData } = useContext(AuthContext);
  const meId = userData ? userData.id : null;
  const queryClient = useQueryClient();
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const prevScrollHeightRef = useRef(0);
  const isAutoScrollRef = useRef(true);

  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const [lastSentMessageId, setLastSentMessageId] = useState(null);

  // --- 1. FETCH DATA ---
  const fetchConversation = async ({ pageParam = null }) => {
    try {
      // Nếu pageParam có giá trị (là chuỗi cursor), nối vào URL. Nếu null thì là trang đầu.
      const url = pageParam
        ? `/conversations/${threadId}/messages?cursor=${pageParam}`
        : `/conversations/${threadId}/messages`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      if (error.response && (error.response.status === 404 || error.response.status === 403)) {
        return { isAccessDenied: true };
      }
      throw error;
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: loadingMessage, // SỬA LỖI 1: Đổi tên isLoading thành loadingMessage để khớp với code bên dưới
    isError
  } = useInfiniteQuery({
    queryKey: ["messages", threadId],
    queryFn: fetchConversation,
    getNextPageParam: (lastPage) => {
      if (lastPage?.isAccessDenied) return undefined;
      // SỬA LỖI: Laravel cursorPaginate trả về 'next_cursor'
      return lastPage.messages?.next_cursor || undefined;
    },
    enabled: !!threadId,
    staleTime: 0, // Đánh dấu dữ liệu là "cũ" ngay lập tức để kích hoạt refetch
    refetchOnMount: true, // Bắt buộc gọi lại API khi vào lại trang
    refetchOnWindowFocus: "always",
    retry: (failureCount, error) => {
      if (error.response && (error.response.status === 404 || error.response.status === 403)) return false;
      return failureCount < 3;
    }
  });

  // SỬA LỖI 2: Khai báo biến firstPageData
  const firstPageData = data?.pages?.[0];

  // --- LƯU Ý QUAN TRỌNG: KHÔNG ĐƯỢC RETURN Ở ĐÂY ---
  // (Chúng ta phải để các hook chạy hết trước khi return Loading/Error)

  const conversationInfo = firstPageData?.conversation;

  // Lấy toàn bộ message raw từ cache
  const rawMessages = useMemo(() => {
    if (!data) return [];
    // Lọc bỏ trang lỗi nếu có
    return data.pages
      .filter(page => !page.isAccessDenied)
      .flatMap((page) => page.messages.data);
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
    if (prevScrollHeightRef.current > 0) {
      const newScrollHeight = containerRef.current.scrollHeight;
      const diff = newScrollHeight - prevScrollHeightRef.current;
      if (diff > 0) {
        containerRef.current.scrollTop = diff;
        prevScrollHeightRef.current = 0;
      }
    } else if (isAutoScrollRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [rawMessages, isFetchingNextPage]);

  // --- 3. NORMALIZE DATA ---
  const normalizedMessages = useMemo(() => {
    // A. Gom tất cả tin nhắn lại và tạo Map để tra cứu nhanh
    const allMessages = rawMessages;
    const msgIdMap = new Map();
    // Map giúp lấy thông tin tin nhắn tức thì bằng ID mà không cần dùng .find() (O(1))
    allMessages.forEach(msg => msgIdMap.set(msg.id, msg));

    // B. Tính toán seenMap
    const seenMap = {}; // Key: message_id, Value: Array[User]

    if (participants.length > 0) {
      participants.forEach(p => {
        // 1. Bỏ qua bản thân & người chưa có last_seen
        // Lưu ý: Đảm bảo trường trong DB là last_seen_message_id (Code cũ bạn ghi last_read_message_id, hãy thống nhất)
        const lastSeenId = p.last_seen_message_id || p.last_read_message_id;

        if (p.user_id === meId || !lastSeenId) return;

        // 2. Lấy tin nhắn tương ứng ra kiểm tra
        const msgToCheck = msgIdMap.get(lastSeenId);

        // 3. LOGIC QUAN TRỌNG: 
        // Chỉ hiển thị nếu tin nhắn đó tồn tại VÀ NGƯỜI GỬI KHÔNG PHẢI LÀ CHÍNH HỌ
        if (msgToCheck && msgToCheck.sender?.id !== p.user_id) {
          if (!seenMap[lastSeenId]) {
            seenMap[lastSeenId] = [];
          }
          seenMap[lastSeenId].push({
            id: p.user.id,
            name: p.user.name,
            avatarUrl: p.user.avatarUrl
          });
        }
      });
    }

    // C. Format dữ liệu cuối cùng
    // Reverse lại để hiển thị từ trên xuống (Cũ nhất -> Mới nhất) hoặc ngược lại tùy UI
    // Ở đây rawMessages thường là từ API (Mới -> Cũ), nên reverse lại để render (Cũ -> Mới)
    const reversed = [...allMessages].reverse();
    const unique = new Map();
    for (const msg of reversed) unique.set(msg.id, msg);

    return Array.from(unique.values()).map((msg) => {
      let status = null;
      if (msg.isSending) status = "sending";
      else if (msg.isError) status = "error";
      else if (msg.sender?.id === meId && msg.id === lastSentMessageId) status = "sent";

      return {
        id: msg.id,
        sender: msg.sender,
        content: msg.content,
        mine: msg.sender?.id === meId,
        status: status,
        errorMessage: msg.errorMessage,
        // Gắn danh sách người xem đã lọc sạch sẽ
        seenBy: seenMap[msg.id] || []
      };
    });
  }, [rawMessages, meId, lastSentMessageId, participants]);

  // --- 4. MUTATION & REALTIME ---
  const sendMessageMutation = useMutation({
    mutationFn: async (content) => {
      const response = await api.post(`/conversations/${threadId}/messages`, { content });
      return response.data;
    },
    onMutate: async (content) => {
      await queryClient.cancelQueries(["messages", threadId]);
      const previousData = queryClient.getQueryData(["messages", threadId]);
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage = {
        id: tempId, content: content, sender: userData, created_at: new Date().toISOString(),
        isSending: true, isError: false,
      };
      queryClient.setQueryData(["messages", threadId], (oldData) => {
        if (!oldData) return oldData;
        const newPages = [...oldData.pages];
        if (newPages[0].isAccessDenied) return oldData; // Safety check
        const firstPage = { ...newPages[0] };
        firstPage.messages = { ...firstPage.messages, data: [optimisticMessage, ...firstPage.messages.data] };
        newPages[0] = firstPage;
        return { ...oldData, pages: newPages };
      });
      isAutoScrollRef.current = true;
      return { previousData, tempId };
    },
    onSuccess: (newMessage, variables, context) => {
      queryClient.setQueryData(["messages", threadId], (oldData) => {
        if (!oldData) return oldData;
        const newPages = [...oldData.pages];
        const firstPage = { ...newPages[0] };
        firstPage.messages = {
          ...firstPage.messages,
          data: firstPage.messages.data.map(msg => msg.id === context.tempId ? newMessage : msg)
        };
        newPages[0] = firstPage;
        return { ...oldData, pages: newPages };
      });
      setLastSentMessageId(newMessage.id);
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["messages", threadId], (oldData) => {
        if (!oldData) return oldData;
        const newPages = [...oldData.pages];
        const firstPage = { ...newPages[0] };
        firstPage.messages = {
          ...firstPage.messages,
          data: firstPage.messages.data.map(msg => {
            if (msg.id === context.tempId) {
              return { ...msg, isSending: false, isError: true, errorMessage: "Gửi thất bại" };
            }
            return msg;
          })
        };
        newPages[0] = firstPage;
        return { ...oldData, pages: newPages };
      });
    },
  });

  const updateMessagesCache = (newMessage) => {
    queryClient.setQueryData(["messages", threadId], (oldData) => {
      if (!oldData) return oldData;
      const newPages = [...oldData.pages];
      if (newPages[0].isAccessDenied) return oldData;
      const firstPage = { ...newPages[0] };
      if (firstPage.messages.data.some(m => m.id === newMessage.id)) return oldData;
      firstPage.messages = { ...firstPage.messages, data: [newMessage, ...firstPage.messages.data] };
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
      if (newMessage.sender_id !== meId) {
        updateMessagesCache(newMessage);
      }
    };

    const handlerRead = (participant) => {
      console.log("participant: ", participant);
    }


    channel.listen(".MessageSent", handler);
    channel.listen("MessageSent", handler);

    channel.listen("MessageRead", handlerRead);
    channel.listen(".MessageRead", handlerRead);

    return () => {
      channel.stopListening(".MessageSent");
      channel.stopListening("MessageSent");

      channel.stopListening("MessageRead");
      channel.stopListening(".MessageRead");

      echoInstance.leave(`private-${channelName}`);
    };
  }, [echoInstance, threadId, queryClient, meId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || loadingMessage) return;
    const hasNoScrollbar = container.scrollHeight <= container.clientHeight;
    if (hasNoScrollbar && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [normalizedMessages, hasNextPage, isFetchingNextPage, loadingMessage]);

  const handleSend = (content) => sendMessageMutation.mutate(content);


  // --- SỬA LỖI 3: CHUYỂN LOGIC RETURN XUỐNG DƯỚI CÙNG ---

  // Kiểm tra Access Denied
  if (firstPageData?.isAccessDenied) {
    return <NotFoundPage />;
  }

  // Kiểm tra Error (500, network...)
  if (isError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">Đã có lỗi xảy ra. Vui lòng thử lại sau.</Typography>
      </Box>
    );
  }

  // Kiểm tra Loading Lần đầu (quan trọng để tránh render UI khi chưa có data)
  if (loadingMessage && !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress /> <Typography ml={2}>Đang tải cuộc trò chuyện...</Typography>
      </Box>
    )
  }

  // --- RENDER MAIN UI ---
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", bgcolor: "#fafafa", borderRadius: 2, p: 2 }}>
        {/* HEADER */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', pb: 1 }}>
          <IconButton
            onClick={() => navigate('/message')} // Quay về trang danh sách
            sx={{ display: { xs: 'flex', md: 'none' } }} // Ẩn trên desktop
          >
            <ArrowBack />
          </IconButton>
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

        {/* MESSAGES LIST */}
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

          {normalizedMessages.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Chưa có tin nhắn nào
              </Typography>
            </Box>
          ) : (
            normalizedMessages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))
          )}
        </Box>

        {/* CHAT INPUT */}
        <ChatInput onSend={handleSend} disabled={false} />
      </Box>

      {/* MODALS */}
      <ParticipantsModal open={isParticipantsOpen} onClose={() => setIsParticipantsOpen(false)} participants={participants} />
      <AddMemberModal open={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} threadId={threadId} currentMemberIds={currentMemberIds} />
    </>
  );
}