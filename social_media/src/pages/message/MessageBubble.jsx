// src/shared/components/MessageBubble.jsx
import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

export default function MessageBubble({ message }) {
  const { sender, content, mine } = message;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: mine ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: 1,
      }}
    >
      {!mine && (
          <Avatar
            alt={sender.name}
            src={sender.avatarUrl || "/static/images/avatar/1.jpg"}
            sx={{ width: 30, height: 30 }}
          >
            {!sender.avatarUrl && sender.name[0].toUpperCase()}
          </Avatar>
        
      )}
      
      <Box
        sx={{
          backgroundColor: mine ? "#1976d2" : "#e0e0e0",
          color: mine ? "#fff" : "#000",
          borderRadius: 2,
          px: 1.5,
          py: 1,
          maxWidth: "70%",
          wordBreak: "break-word",
        }}
      >
        {!mine && (
        <Typography
            variant="caption"
            sx={{ mb: 0.3, color: "text.secondary" }}
          >
            {sender.name}
          </Typography>
        )}
        <Typography variant="body2">{content}</Typography>
      </Box>
    </Box>
  );
}
