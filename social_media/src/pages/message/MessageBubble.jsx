// src/shared/components/MessageBubble.jsx
import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

export default function MessageBubble({ message }) {
  const { sender, text, mine } = message;

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
          alt={sender}
          src="/static/images/avatar/1.jpg"
          sx={{ width: 30, height: 30 }}
        />
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
        <Typography variant="body2">{text}</Typography>
      </Box>
    </Box>
  );
}
