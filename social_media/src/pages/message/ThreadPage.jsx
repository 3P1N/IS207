import React, { useEffect, useMemo, useContext, useRef, useLayoutEffect, useState } from "react";
import { Box, Typography, CircularProgress, IconButton, Tooltip, ButtonBase } from "@mui/material";
import { useParams } from "react-router-dom";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PersonAdd, VideoCall } from "@mui/icons-material";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";
import { VideoCallContext } from "../../router/VideoCallProvider";

import ParticipantsModal from "./ParticipantsModal";
import AddMemberModal from "./AddMemberModal";

export default function ThreadPage() {
  const { threadId } = useParams();
  const { echoInstance, userData } = useContext(AuthContext);
  const meId = userData ? userData.id : null;
  const queryClient = useQueryClient();
  // const { startCall } = useContext(VideoCallContext);
  const containerRef = useRef(null);
  // Ref để lưu chiều cao cũ trước khi load thêm tin nhắn
  const prevScrollHeightRef = useRef(0);
  const isAutoScrollRef = useRef(true); // Cờ kiểm soát việc tự động cuộn xuống đáy

  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  // --- 1. FETCH DATA VỚI INFINITE QUERY ---
  const fetchConversation = async ({ pageParam = 1 }) => {
    // Laravel paginate tự nhận param ?page=X
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
      // Logic lấy trang tiếp theo dựa trên response của Laravel simplePaginate/paginate
      const msgData = lastPage.messages;
      // Nếu current_page < last_page (hoặc check next_page_url) thì +1
      if (msgData.next_page_url) {
        return msgData.current_page + 1;
      }
      return undefined;
    },
    enabled: !!threadId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // Flat data từ các pages thành 1 mảng duy nhất
  // Server trả về: Page 1 (Mới nhất), Page 2 (Cũ hơn)...
  // Mỗi page chứa list tin nhắn sort DESC (Mới -> Cũ)
  // => Ta cần gộp lại và ĐẢO NGƯỢC toàn bộ để hiển thị từ Cũ -> Mới (Trên -> Dưới)
  const conversationInfo = data?.pages?.[0]?.conversation; // Lấy info từ trang đầu

  const rawMessages = useMemo(() => {
    if (!data) return [];
    // Gộp tất cả messages từ các trang lại
    const allMsgs = data.pages.flatMap((page) => page.messages.data);
    return allMsgs;
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

  const handleVideoCallClick = () => {
    // Gọi hàm startCall từ Provider. 
    // Truyền vào ID cuộc hội thoại và thông tin người nhận (để hiển thị UI "Đang gọi cho A...")
    startCall(threadId, {
        name: displayInfo.name,
        avatar: displayInfo.avatar,
        id: displayInfo.id
    });
  };

  // --- 2. XỬ LÝ SCROLL LOGIC ---

  // Xử lý sự kiện scroll để load thêm
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight } = e.target;

    // Nếu kéo lên đỉnh (scrollTop = 0) và còn trang cũ hơn
    if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      // Lưu lại chiều cao hiện tại trước khi data mới được chèn vào
      prevScrollHeightRef.current = scrollHeight;
      isAutoScrollRef.current = false; // Tắt auto scroll bottom
      fetchNextPage();
    }
  };

  // UseLayoutEffect để chỉnh lại thanh cuộn ngay sau khi render xong data mới
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // Case 1: Load thêm tin nhắn cũ (Reverse Scroll)
    if (!isAutoScrollRef.current && prevScrollHeightRef.current > 0) {
      const newScrollHeight = containerRef.current.scrollHeight;
      // Tính độ chênh lệch và set lại scrollTop để user không bị nhảy view
      const diff = newScrollHeight - prevScrollHeightRef.current;
      containerRef.current.scrollTop = diff;

      // Reset
      prevScrollHeightRef.current = 0;
    }

    // Case 2: Load lần đầu hoặc gửi tin nhắn mới (Scroll to bottom)
    else if (isAutoScrollRef.current || (!isFetchingNextPage && !prevScrollHeightRef.current)) {
      // Chỉ scroll bottom nếu đang ở chế độ auto hoặc lần đầu load
      // (Thêm logic kiểm tra nếu user đang xem tin nhắn cũ thì không auto scroll khi có tin mới đến nếu muốn)
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

  }, [rawMessages, isFetchingNextPage]); // Chạy khi messages thay đổi

  // --- 3. NORMALIZE DATA ---
  const normalizedMessages = useMemo(() => {
    // Đảo ngược mảng tổng để hiển thị theo thời gian: Cũ (trên) -> Mới (dưới)
    // Lưu ý: data từ server (DESC) -> [MsgMới, MsgCũ]. Flat lại -> [Mới...Cũ]. Reverse -> [Cũ...Mới]
    const reversed = [...rawMessages].reverse();

    // Loại bỏ trùng lặp (đề phòng)
    const unique = new Map();
    for (const msg of reversed) unique.set(msg.id, msg);

    return Array.from(unique.values()).map((msg) => ({
      id: msg.id, sender: msg.sender, content: msg.content, mine: msg.sender?.id === meId,
    }));
  }, [rawMessages, meId]);


  // --- 4. SEND MESSAGE & REAL-TIME ---
  const sendMessageMutation = useMutation({
    mutationFn: async (content) => {
      const response = await api.post(`/conversations/${threadId}/messages`, { content });
      return response.data;
    },
    // Optimistic update hoặc update cache sau khi gửi thành công
    onSuccess: (newMessage) => {
      // Khi gửi tin nhắn của chính mình, bật auto scroll
      isAutoScrollRef.current = true;
      updateMessagesCache(newMessage);
    },
  });

  // Hàm helper cập nhật cache cho Infinite Query
  const updateMessagesCache = (newMessage) => {
    queryClient.setQueryData(["messages", threadId], (oldData) => {
      if (!oldData) return oldData;

      // Infinite Query structure: { pages: [ { messages: { data: [...] } }, ... ], pageParams: [...] }
      // Ta chỉ cần chèn tin nhắn mới vào đầu của Page 0 (Page mới nhất)
      // Vì Server trả về DESC, nên phần tử đầu tiên của Page 0 là tin mới nhất.

      const newPages = [...oldData.pages];
      const firstPage = { ...newPages[0] };
      const firstPageMsgs = { ...firstPage.messages };

      // Kiểm tra trùng
      if (firstPageMsgs.data.some(m => m.id === newMessage.id)) return oldData;

      // Chèn vào đầu mảng (vì backend sort DESC)
      firstPageMsgs.data = [newMessage, ...firstPageMsgs.data];

      firstPage.messages = firstPageMsgs;
      newPages[0] = firstPage;

      return { ...oldData, pages: newPages };
    });
  };

  useEffect(() => {
    if (!echoInstance || !threadId) return;
    const channelName = `chat.${threadId}`;
    const channel = echoInstance.private(channelName);

    const handler = (newMessage) => {
      // Nếu user đang ở dưới cùng, cho phép auto scroll. Nếu đang xem lịch sử cũ, không scroll.
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
        isAutoScrollRef.current = isAtBottom;
      }
      updateMessagesCache(newMessage);
    };

    channel.listen(".MessageSent", handler);
    channel.listen("MessageSent", handler);

    return () => {
      channel.stopListening(".MessageSent");
      channel.stopListening("MessageSent");
      echoInstance.leave(`private-${channelName}`);
    };
  }, [echoInstance, threadId, queryClient]);

  // --- 5. AUTO-FILL (FIX LỖI MÀN HÌNH LỚN) ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container || loadingMessage) return;

    // Kiểm tra: Nếu nội dung nhỏ hơn khung nhìn (chưa có thanh cuộn)
    // VÀ còn trang tiếp theo để load
    // VÀ không đang trong quá trình load
    const hasNoScrollbar = container.scrollHeight <= container.clientHeight;

    if (hasNoScrollbar && hasNextPage && !isFetchingNextPage) {
      // Tự động load trang tiếp theo để lấp đầy màn hình
      fetchNextPage();
    }
  }, [normalizedMessages, hasNextPage, isFetchingNextPage, loadingMessage]);

  const handleSend = (content) => sendMessageMutation.mutate(content);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", bgcolor: "#fafafa", borderRadius: 2, p: 2 }}>

        {/* --- HEADER --- */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', pb: 1 }}>
          <ButtonBase onClick={() => setIsParticipantsOpen(true)} sx={{ /* ... style cũ */ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderRadius: 1, p: 0.5, px: 1, '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } }}>
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
            {/* <Tooltip title="Gọi Video">
              <IconButton
                color="primary"
                onClick={handleVideoCallClick}
                sx={{ mr: 1 }}
              >
                <VideoCall />
              </IconButton>
            </Tooltip> */}
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
          onScroll={handleScroll} // Thêm sự kiện scroll
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
          {/* Hiển thị Loading khi đang fetch trang cũ hơn */}
          {isFetchingNextPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
              <CircularProgress size={20} />
            </Box>
          )}

          {/* Render tin nhắn */}
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
            normalizedMessages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
          )}


          {sendMessageMutation.isPending && <Typography variant="body2" sx={{ color: "text.secondary", alignSelf: 'flex-end' }}>Đang gửi...</Typography>}
        </Box>

        {/* --- CHAT INPUT --- */}
        <ChatInput onSend={handleSend} disabled={sendMessageMutation.isPending} />
      </Box>

      {/* --- MODALS --- */}
      <ParticipantsModal open={isParticipantsOpen} onClose={() => setIsParticipantsOpen(false)} participants={participants} />
      <AddMemberModal open={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} threadId={threadId} currentMemberIds={currentMemberIds} />
  
    </>
  );
}