// src/shared/components/MessageBubble.jsx
import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import AvatarUser from "../../shared/components/AvatarUser";

export default function MessageBubble({ message }) {
  const { sender, content, mine } = message;
  // console.log(message);
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
          <AvatarUser userData={sender}/>
        
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
