import * as React from "react";
import { useState, useEffect, useContext, useMemo } from "react";
import { List, ListItemButton, ListItemText, ListItemAvatar, Avatar } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import AvatarUser from "../../shared/components/AvatarUser";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";

export default function ThreadList() {
  const { token, userData } = useContext(AuthContext);
  const [threads, setThreads] = useState([]);
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
    }
  }

  const mockThreads = [
    { id: 1, name: "Nguyễn Văn A", avatar: "image.png" },
    { id: 2, name: "Lê Thị B", avatar: "image.png" },
    { id: 3, name: "Trần Văn C", avatar: "image.png" },
    { id: 1, name: "Nguyễn Văn A", avatar: "image.png" },
    { id: 2, name: "Lê Thị B", avatar: "image.png" },
    { id: 3, name: "Trần Văn C", avatar: "image.png" },
    { id: 1, name: "Nguyễn Văn A", avatar: "image.png" },
    { id: 2, name: "Lê Thị B", avatar: "image.png" },
    { id: 3, name: "Trần Văn C", avatar: "image.png" },
    { id: 1, name: "Nguyễn Văn A", avatar: "image.png" },
    { id: 2, name: "Lê Thị B", avatar: "image.png" },
    { id: 3, name: "Trần Văn C", avatar: "image.png" },
  ];

  // Chuẩn hoá: lấy tên người còn lại (đối phương) trong cuộc trò chuyện 1-1
  const normalizedThreads = useMemo(() => {
    return (threads || []).map((t) => {
      const participants = Array.isArray(t.participants) ? t.participants : [];

      const others = participants.filter((p) => p.user_id !== meId);
      
      const other = others[0]; // 1-1 thì chỉ cần người đầu tiên khác mình

      const displayName =
        other?.user?.name
        ?? ( "Cuộc trò chuyện");

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

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {normalizedThreads.map((thread) => (
        <ListItemButton
          key={thread.conversationId}
          component={RouterLink}
          to={`/message/${thread.conversationId}`} // ✅ điều hướng đến /message/:id
          sx={{
            borderRadius: 2,
            mb: 0.5,
            "&.active": { backgroundColor: "#e3f2fd" }, // highlight khi đang mở
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <AvatarUser img={thread.avatarUrl} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={thread.displayName} secondary={`Tin nhắn gần nhất...`} />

        </ListItemButton>
      ))}
    </List>
  );
}
