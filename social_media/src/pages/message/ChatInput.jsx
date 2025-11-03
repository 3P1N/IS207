// src/shared/components/ChatInput.jsx
import React, { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() === "") return;
    onSend(text);
    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mt: 1.5,
        bgcolor: "#fff",
        borderRadius: 2,
        boxShadow: "0 0 4px rgba(0,0,0,0.1)",
        p: 1,
      }}
    >
      <TextField
        placeholder="Nhập tin nhắn..."
        variant="standard"
        fullWidth
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyPress}
        InputProps={{
          disableUnderline: true,
          sx: { px: 1 },
        }}
      />
      <IconButton color="primary" onClick={handleSend}>
        <SendIcon />
      </IconButton>
    </Box>
  );
}
