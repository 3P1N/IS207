import * as React from "react";
import { useContext, useMemo, useState, useEffect } from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Typography,
  TextField,
  InputAdornment,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link as RouterLink } from "react-router-dom";
// --- 1. SỬA: Import thêm useQueryClient ---
import { useQuery, useQueryClient } from "@tanstack/react-query"; 
import AvatarUser from "../../shared/components/AvatarUser";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";

export default function ThreadList() {
  // --- 2. SỬA: Khởi tạo queryClient ---
  const queryClient = useQueryClient(); 
  
  const { userData, echoInstance } = useContext(AuthContext);
  const meId = userData ? userData.id : null;

  // --- STATE TÌM KIẾM ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- HÀM FETCH DATA ---
  const fetchThreads = async () => {
    const response = await api.get("/conversations");
    return response.data;
  };

  // --- SỬ DỤNG USEQUERY ---
  const { data: threads = [], isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: fetchThreads,
    staleTime: 30 * 1000,
    enabled: !!meId,
    refetchOnWindowFocus: false,
  });

  // --- CHUẨN HÓA DỮ LIỆU ---
  const normalizedThreads = useMemo(() => {
    if (!Array.isArray(threads)) return [];

    return threads.map((t) => {
      const participants = Array.isArray(t.participants) ? t.participants : [];
      const others = participants.filter((p) => p.user_id !== meId);
      const other = others[0];

      const displayName = t.name ?? other?.user?.name ?? "Cuộc trò chuyện";
      const avatarUrl = other?.user?.avatar || "image.png";
      const conversationId = t.conversation_id ?? t.id;
      // Lưu ý: Nếu t.last_message là object (do socket update), logic này vẫn chạy đúng vì nó lấy .content
      const last_message = t?.last_message?.content ?? "Chưa có tin nhắn nào";
      return {
        conversationId,
        displayName,
        avatarUrl,
        last_message
      };
    });
  }, [threads, meId]);

  // --- LOGIC LỌC TÌM KIẾM ---
  const filteredThreads = useMemo(() => {
    if (!searchTerm) return normalizedThreads;
    return normalizedThreads.filter((thread) =>
      thread.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [normalizedThreads, searchTerm]);

  // --- EFFECT LẮNG NGHE SOCKET ---
 useEffect(() => {
    if (!userData?.id || !echoInstance) return;

    // Channel riêng của user để nhận tin mới từ mọi group/chat
    const channelName = `conversations.${userData.id}`;
    const channel = echoInstance.private(channelName);

    const handler = (event) => {
      // Kiểm tra cấu trúc event trả về
      // Thông thường event sẽ chứa { message: {...}, conversation_id: ... }
      // Hoặc đôi khi chính là object message nếu backend broadcast thẳng model.
      
      const incomingMessage = event.message || event; 
      const conversationId = event.conversation_id || incomingMessage.conversation_id;

      if (!conversationId) return;

      queryClient.setQueryData(["conversations"], (oldThreads) => {
        if (!Array.isArray(oldThreads)) return oldThreads;

        const targetIndex = oldThreads.findIndex(
          (t) => (t.conversation_id ?? t.id) == conversationId
        );

        // Trường hợp 1: Thread đã có trong list -> Cập nhật và đưa lên đầu
        if (targetIndex > -1) {
          const targetThread = oldThreads[targetIndex];
          
          const updatedThread = {
            ...targetThread,
            last_message: incomingMessage, // Cập nhật message mới nhất
            updated_at: incomingMessage.created_at || new Date().toISOString()
          };

          const otherThreads = oldThreads.filter((_, index) => index !== targetIndex);
          return [updatedThread, ...otherThreads];
        }

        // Trường hợp 2: Tin nhắn từ cuộc trò chuyện mới chưa có trong list
        // Cách tốt nhất là fetch lại list để đảm bảo dữ liệu đầy đủ (participants, name...)
        queryClient.invalidateQueries(["conversations"]);
        return oldThreads;
      });
    };

    // Lắng nghe nhiều tên sự kiện để chắc chắn bắt được (giống ThreadPage)
    channel.listen(".MessageSent", handler);
    channel.listen("MessageSent", handler);
    channel.listen(".ConversationSent", handler); // Giữ lại cái cũ của bạn đề phòng

    // Cleanup function chuẩn
    return () => {
      channel.stopListening(".MessageSent");
      channel.stopListening("MessageSent");
      channel.stopListening(".ConversationSent");
      echoInstance.leave(channelName); // Rời channel khi unmount
    };
  }, [userData?.id, echoInstance, queryClient]);

  // --- RENDER ---
  if (isLoading) {
    return (
      <Typography variant="body2" sx={{ color: "text.secondary", p: 2 }}>
        Đang tải danh sách tin nhắn...
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {/* --- THANH TÌM KIẾM --- */}
      <Box sx={{ p: 2, pb: 0 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Tìm kiếm đoạn chat..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1 }}
        />
      </Box>

      {/* --- DANH SÁCH THREAD --- */}
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {filteredThreads.length === 0 ? (
          <Typography variant="body2" sx={{ p: 2, textAlign: "center" }}>
            {searchTerm
              ? "Không tìm thấy cuộc trò chuyện nào."
              : "Chưa có cuộc trò chuyện nào."}
          </Typography>
        ) : (
          filteredThreads.map((thread) => (
            <ListItemButton
              key={thread.conversationId}
              component={RouterLink}
              to={`/message/${thread.conversationId}`}
              sx={{
                borderRadius: 2,
                mx: 1,
                mb: 0.5,
                "&.active": { backgroundColor: "#e3f2fd" },
              }}
            >
              <ListItemAvatar>
                <AvatarUser
                  userData={{
                    name: thread.displayName,
                    avatarUrl: thread.avatarUrl,
                    id: thread.conversationId,
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={thread.displayName}
                secondary={thread.last_message}
                primaryTypographyProps={{
                  fontWeight: 500,
                  noWrap: true,
                }}
                secondaryTypographyProps={{
                  noWrap: true,
                }}
              />
            </ListItemButton>
          ))
        )}
      </List>
    </Box>
  );
}