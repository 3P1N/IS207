import * as React from "react";
import { useState, useEffect, useContext, useMemo } from "react";
import { List, ListItemButton, ListItemText, ListItemAvatar, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import AvatarUser from "../../shared/components/AvatarUser";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";

export default function ThreadList() {
  const { token, userData } = useContext(AuthContext);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const meId = userData ? userData.id : null;
  useEffect(() => {
    const fetchThreads = async () => {
      const threadsList = await getThreads();
      setThreads(threadsList);
    };

    fetchThreads();
  }, []);

  const getThreads = async () => {
    // Gọi API để lấy danh sách cuộc trò chuyện
    setLoading(true);
    try {
      const response = await api.get("/conversations", {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 thêm token tại đây
        },
      });
      return response.data; // Giả sử API trả về mảng cuộc trò chuyện trong thuộc tính 'conversations'
    } catch (error) {
      console.error("Error fetching threads:", error);
      return [];
    }finally{
      setLoading(false);
    }
    
  }


  // Chuẩn hoá: lấy tên người còn lại (đối phương) trong cuộc trò chuyện 1-1
  const normalizedThreads = useMemo(() => {
    return (threads || []).map((t) => {
      const participants = Array.isArray(t.participants) ? t.participants : [];

      const others = participants.filter((p) => p.user_id !== meId);

      const other = others[0]; // 1-1 thì chỉ cần người đầu tiên khác mình

      const displayName =
        other?.user?.name
        ?? ("Cuộc trò chuyện");

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

  return loading ? (
    <Typography variant="body2" sx={{ color: "text.secondary" }}>
      Đang tải danh sách tin nhắn...
    </Typography>
  ) : (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {normalizedThreads.map((thread) => (
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
            <AvatarUser userData={{ name: thread.displayName, avatarUrl: thread.avatarUrl, id: thread.conversationId }} />
          </ListItemAvatar>
          <ListItemText
            primary={thread.displayName}
            secondary={`Tin nhắn gần nhất...`}
          />
        </ListItemButton>
      ))}
    </List>
  );

}
