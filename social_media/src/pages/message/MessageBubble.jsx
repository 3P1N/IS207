// src/shared/components/MessageBubble.jsx
import React from "react";
import { Box, Typography, Avatar, Tooltip } from "@mui/material";
import AvatarUser from "../../shared/components/AvatarUser"; // Giả sử component này hiển thị avatar lớn

export default function MessageBubble({ message }) {
  // Lấy thêm prop seenBy từ message
  const { sender, content, mine, status, errorMessage, seenBy } = message;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: mine ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: 1,
        mb: seenBy && seenBy.length > 0 ? 1.5 : 0 // Thêm margin bottom nếu có avatar "đã xem" để tránh dính
      }}
    >
      {/* Avatar người gửi (người khác) */}
      {!mine && <AvatarUser userData={sender} />}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: mine ? "flex-end" : "flex-start",
          maxWidth: "70%",
          position: "relative" // Để căn chỉnh vị trí seenBy nếu cần
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
            width: "fit-content",
            wordBreak: "break-word",
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

        {/* --- KHU VỰC HIỂN THỊ STATUS & SEEN BY --- */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 0.5, gap: 1 }}>
            
            {/* 1. Trạng thái gửi (Sending/Error) - Chỉ hiện cho mình */}
            {mine && status && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.75rem",
                  color: status === "error" ? "error.main" : "text.secondary",
                }}
              >
                {status === "sending" && "Đang gửi..."}
                {status === "sent" && "Đã gửi"}
                {status === "error" && (errorMessage || "Lỗi")}
              </Typography>
            )}

            {/* 2. HIỂN THỊ NGƯỜI ĐÃ XEM (Seen By) */}
            {seenBy && seenBy.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}> 
                   {/* flexDirection row-reverse để avatar đè lên nhau đẹp hơn nếu dùng margin âm */}
                   {seenBy.map((user) => (
                       <Tooltip key={user.id} title={`Đã xem bởi ${user.name}`} arrow>
                           
                       </Tooltip>
                   ))}
                </Box>
            )}
        </Box>
      </Box>
    </Box>
  );
}