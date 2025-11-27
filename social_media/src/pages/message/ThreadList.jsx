import * as React from "react";
import { useContext, useMemo, useState } from "react"; // 1. Import useState
import {
  List,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Typography,
  TextField, // 2. Import TextField cho ô tìm kiếm
  InputAdornment,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // 3. Import Icon Search
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AvatarUser from "../../shared/components/AvatarUser";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";

export default function ThreadList() {
  const { userData } = useContext(AuthContext);
  const meId = userData ? userData.id : null;

  // --- STATE TÌM KIẾM ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- 1. HÀM FETCH DATA ---
  const fetchThreads = async () => {
    const response = await api.get("/conversations");
    return response.data;
  };

  // --- 2. SỬ DỤNG USEQUERY ---
  const { data: threads = [], isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: fetchThreads,
    staleTime: 30 * 1000,
    enabled: !!meId,
    refetchOnWindowFocus: false,
  });

  // --- 3. CHUẨN HÓA DỮ LIỆU ---
  const normalizedThreads = useMemo(() => {
    if (!Array.isArray(threads)) return [];

    return threads.map((t) => {
      const participants = Array.isArray(t.participants) ? t.participants : [];
      const others = participants.filter((p) => p.user_id !== meId);
      const other = others[0];

      const displayName = t.name ?? other?.user?.name ?? "Cuộc trò chuyện";
      const avatarUrl = other?.user?.avatar || "image.png";
      const conversationId = t.conversation_id ?? t.id;

      return {
        conversationId,
        displayName,
        avatarUrl,
      };
    });
  }, [threads, meId]);

  // --- 4. LOGIC LỌC TÌM KIẾM (MỚI) ---
  const filteredThreads = useMemo(() => {
    // Nếu không có từ khóa search, trả về list gốc
    if (!searchTerm) return normalizedThreads;

    // Lọc theo tên (chuyển về chữ thường để so sánh chính xác hơn)
    return normalizedThreads.filter((thread) =>
      thread.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [normalizedThreads, searchTerm]);

  // --- 5. RENDER ---
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
          // Render danh sách đã lọc (filteredThreads) thay vì danh sách gốc
          filteredThreads.map((thread) => (
            <ListItemButton
              key={thread.conversationId}
              component={RouterLink}
              to={`/message/${thread.conversationId}`}
              sx={{
                borderRadius: 2,
                mx: 1, // Thêm margin ngang một chút cho đẹp so với ô search
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
    </Box>
  );
}