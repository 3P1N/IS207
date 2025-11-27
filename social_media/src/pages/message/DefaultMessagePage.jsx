import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import MailOutlineIcon from "@mui/icons-material/MailOutline"; // icon thư

export default function DefaultMessagePage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "91vh",
        
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, color: "#1976d2" }}>
        Chọn một cuộc trò chuyện để bắt đầu
      </Typography>

      {/* Animation thư bay ngang */}
      <motion.div
        style={{ position: "absolute", top: "35%" }}
        animate={{ x: ["-100%", "100%"], rotate: [0, 10, -10, 0] }} // bay kèm xoay nhẹ
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
      >
        <MailOutlineIcon sx={{ fontSize: 60, color: "#1976d2" }} />
      </motion.div>

      <Typography variant="body1" sx={{ color: "#555" }}>
        Bức thư đang trên đường tới bạn 🕊️
      </Typography>
    </Box>
  );
}
