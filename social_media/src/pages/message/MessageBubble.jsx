// src/shared/components/MessageBubble.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import AvatarUser from "../../shared/components/AvatarUser";

export default function MessageBubble({ message }) {
  // Lấy thêm status và errorMessage từ message object (đã normalize ở ThreadPage)
  const { sender, content, mine, status, errorMessage } = message;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: mine ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: 1,
      }}
    >
      {/* Avatar người khác */}
      {!mine && <AvatarUser userData={sender} />}

      {/* WRAPPER: Chứa Bong bóng chat + Dòng trạng thái bên dưới
         Dùng flex-column để xếp chồng status xuống dưới bubble
      */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: mine ? "flex-end" : "flex-start", // Căn phải nếu là mình
          maxWidth: "70%",
        }}
      >
        {/* BONG BÓNG CHAT */}
        <Box
          sx={{
            backgroundColor: mine ? "#1976d2" : "#e0e0e0",
            color: mine ? "#fff" : "#000",
            borderRadius: 2,
            px: 1.5,
            py: 1,
            width: "fit-content", // Ôm sát nội dung
            wordBreak: "break-word",
            // Nếu đang gửi thì làm mờ đi 1 chút cho đẹp
            opacity: status === "sending" ? 0.7 : 1, 
          }}
        >
          {!mine && (
            <Typography
              variant="caption"
              sx={{ display: "block", mb: 0.3, color: "text.secondary", fontWeight: 'bold' }}
            >
              {sender.name}
            </Typography>
          )}
          <Typography variant="body2">{content}</Typography>
        </Box>

        {/* TRẠNG THÁI GỬI (Chỉ hiện cho tin nhắn của mình) */}
        {mine && status && (
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              mr: 0.5, // Thụt vào 1 chút cho thẳng hàng
              fontSize: "0.75rem",
              // Nếu lỗi thì màu đỏ, còn lại màu xám
              color: status === "error" ? "error.main" : "text.secondary",
            }}
          >
            {status === "sending" && "Đang gửi..."}
            {status === "sent" && "Đã gửi"}
            {status === "error" && (errorMessage || "Gửi lỗi. Nhấn để thử lại.")}
          </Typography>
        )}
      </Box>
    </Box>
  );
}