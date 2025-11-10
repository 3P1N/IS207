import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { List, ListItemButton, ListItemText, ListItemAvatar, Avatar } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import AvatarUser from "../../shared/components/AvatarUser";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";

export default function ThreadList() {
  const {token} = useContext(AuthContext);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const friendsList = await getFriends();
      setFriends(friendsList);
    };

    fetchFriends();
  }, []);

  const getFriends = async () => {
    // Gọi API để lấy danh sách bạn bè
    try {
      const response = await api.get("/friends", {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 thêm token tại đây
        },
      });
      return response.data.friends; // Giả sử API trả về mảng bạn bè trong thuộc tính 'friends'
    } catch (error) {
      console.error("Error fetching friends:", error);
      return [];
    }
  }

  const threads = [
    { id: 1, name: "Nguyễn Văn A" , avatar:"image.png"},
    { id: 2, name: "Lê Thị B" , avatar:"image.png"},
    { id: 3, name: "Trần Văn C", avatar:"image.png" },
    { id: 1, name: "Nguyễn Văn A" , avatar:"image.png"},
    { id: 2, name: "Lê Thị B" , avatar:"image.png"},
    { id: 3, name: "Trần Văn C", avatar:"image.png" },
    { id: 1, name: "Nguyễn Văn A" , avatar:"image.png"},
    { id: 2, name: "Lê Thị B" , avatar:"image.png"},
    { id: 3, name: "Trần Văn C", avatar:"image.png" },
    { id: 1, name: "Nguyễn Văn A" , avatar:"image.png"},
    { id: 2, name: "Lê Thị B" , avatar:"image.png"},
    { id: 3, name: "Trần Văn C", avatar:"image.png" },
  ];

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {friends.map((friend) => (
        <ListItemButton
          key={friend.id}
          component={RouterLink}
          to={`/message/${friend.id}`} // ✅ điều hướng đến /message/:id
          sx={{
            borderRadius: 2,
            mb: 0.5,
            "&.active": { backgroundColor: "#e3f2fd" }, // highlight khi đang mở
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <AvatarUser img={"image.png"} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={friend.name} secondary={`Tin nhắn gần nhất...`} />

        </ListItemButton>
      ))}
    </List>
  );
}
