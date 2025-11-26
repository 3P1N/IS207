import ThreadList from "./ThreadList";
import { Outlet } from "react-router-dom";
import { useOutlet } from "react-router-dom";
import { Box,Button  } from "@mui/material";
import DefaultMessagePage from "./DefaultMessagePage";
import CreateConversationModal from "./CreateConversationModal";
import { useState } from "react";
export default function MessageLayout() {
  const outlet = useOutlet();
  const [isCreateConversation, setIsCreateConversation] = useState(false);
  return (
    <>
    <Box
      sx={{
        display: "flex",
        height: "91vh",
        bgcolor: "#f9f9f9",
      }}
    >
      {/* Cột trái - danh sách thread */}
      <Box
        sx={{
          width: 320,
          borderRight: "1px solid #ddd",
          overflowY: "auto",       // ✅ cho phép cuộn dọc
          height: "100%",          // chiếm toàn bộ chiều cao
          bgcolor: "white",
        }}
      >
        <Box sx={{ p: 1, borderBottom: "1px solid #eee" }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              setIsCreateConversation(true);
              console.log("Thêm cuộc trò chuyện mới"); // TODO: xử lý mở form tạo thread
            }}
          >
            Thêm cuộc trò chuyện mới
          </Button>
        </Box>
        <ThreadList />
      </Box>

      {/* Cột phải - nội dung tin nhắn */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f5f6fa",
        }}
      >
        {outlet || <DefaultMessagePage />}
      </Box>
    </Box>
    {isCreateConversation && (
       <CreateConversationModal
        onClose={()=>setIsCreateConversation(false)}
       />)}
    </>
  );
}
