import * as React from "react";
import { useContext, useMemo } from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
// 1. Import hook
import { useQuery } from "@tanstack/react-query";
import AvatarUser from "../../shared/components/AvatarUser";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";

export default function ThreadList() {
  const { userData } = useContext(AuthContext);
  const meId = userData ? userData.id : null;

  // --- 1. HÀM FETCH DATA ---
  const fetchThreads = async () => {
    const response = await api.get("/conversations");
    return response.data; // Chỉ return data, không set state
  };

  // --- 2. SỬ DỤNG USEQUERY ---
  const { data: threads = [], isLoading } = useQuery({
    queryKey: ["conversations"], // Key định danh cho list chat
    queryFn: fetchThreads,
    staleTime: 30 * 1000, // Cache dữ liệu trong 30s
    enabled: !!meId, // Chỉ fetch khi đã có thông tin user (đã đăng nhập)
    refetchOnWindowFocus: false,
  });

  // --- 3. CHUẨN HÓA DỮ LIỆU (Logic giữ nguyên) ---
  const normalizedThreads = useMemo(() => {
    // Đảm bảo threads là mảng trước khi map
    if (!Array.isArray(threads)) return [];

    return threads.map((t) => {
      const participants = Array.isArray(t.participants) ? t.participants : [];

      // Lọc ra người kia (không phải mình)
      const others = participants.filter((p) => p.user_id !== meId);
      const other = others[0]; 

      const displayName = t.name ?? other?.user?.name ?? "Cuộc trò chuyện";
      const avatarUrl = other?.user?.avatar || "image.png";

      // Ưu tiên conversation_id để điều hướng
      const conversationId = t.conversation_id ?? t.id;

      return {
        conversationId,
        displayName,
        avatarUrl,
      };
    });
  }, [threads, meId]);

  // --- 4. RENDER ---
  if (isLoading) {
    return (
      <Typography variant="body2" sx={{ color: "text.secondary", p: 2 }}>
        Đang tải danh sách tin nhắn...
      </Typography>
    );
  }

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {normalizedThreads.length === 0 ? (
        <Typography variant="body2" sx={{ p: 2, textAlign: "center" }}>
          Chưa có cuộc trò chuyện nào.
        </Typography>
      ) : (
        normalizedThreads.map((thread) => (
          <ListItemButton
            key={thread.conversationId}
            component={RouterLink}
            to={`/message/${thread.conversationId}`}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              "&.active": { backgroundColor: "#e3f2fd" },
            }}
          >
            <ListItemAvatar>
              {/* Tạo object user giả lập để truyền vào AvatarUser */}
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
              secondary={`Tin nhắn gần nhất...`}
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
  );
}