import ThreadList from "./ThreadList";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

export default function MessageLayout() {
  return (
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
        <Outlet /> {/* ✅ Hiển thị ThreadPage tương ứng */}
      </Box>
    </Box>
  );
}
