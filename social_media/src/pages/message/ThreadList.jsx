import * as React from "react";
import { List, ListItemButton, ListItemText, ListItemAvatar, Avatar } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import AvatarUser from "../../shared/components/AvatarUser";

export default function ThreadList() {
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
      {threads.map((thread) => (
        <ListItemButton
          key={thread.id}
          component={RouterLink}
          to={`/message/${thread.id}`} // ✅ điều hướng đến /message/:id
          sx={{
            borderRadius: 2,
            mb: 0.5,
            "&.active": { backgroundColor: "#e3f2fd" }, // highlight khi đang mở
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <AvatarUser img={thread.img} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={thread.name} secondary={`Tin nhắn gần nhất...`} />
          
        </ListItemButton>
      ))}
    </List>
  );
}
