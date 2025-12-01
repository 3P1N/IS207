import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

// Component Đám mây trôi nền (giữ nguyên)
const Cloud = ({ top, left, scale, duration, delay }) => (
  <motion.div
    style={{ position: "absolute", top, left, opacity: 0.8, zIndex: 0 }}
    animate={{ x: [0, 50, 0] }}
    transition={{ duration: duration, repeat: Infinity, ease: "easeInOut", delay: delay }}
  >
    <svg width={100 * scale} height={60 * scale} viewBox="0 0 100 60" fill="white">
      <path d="M25,50 C10,50 5,35 15,25 C15,10 35,5 45,15 C50,5 75,5 80,20 C95,20 95,45 80,50 Z" />
    </svg>
  </motion.div>
);

// Component Gió lướt qua (giữ nguyên)
const WindLine = ({ top, delay, duration }) => (
  <motion.div
    style={{
      position: "absolute",
      top,
      right: "-10%",
      height: "2px",
      background: "rgba(255,255,255,0.6)",
      borderRadius: "2px",
    }}
    animate={{
      width: ["0px", "100px", "0px"],
      x: [0, -400],
      opacity: [0, 1, 0],
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      ease: "linear",
      delay: delay,
    }}
  />
);

export default function DefaultMessagePage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%", 
        minHeight: "500px",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
      }}
    >
      {/* --- Background Elements --- */}
      <Cloud top="15%" left="10%" scale={1.2} duration={8} delay={0} />
      <Cloud top="25%" left="75%" scale={0.8} duration={10} delay={2} />
      <Cloud top="60%" left="5%" scale={0.6} duration={12} delay={1} />
      
      <WindLine top="30%" delay={0.5} duration={2} />
      <WindLine top="50%" delay={1.2} duration={2.5} />
      <WindLine top="70%" delay={0.2} duration={1.8} />

      {/* --- Main Illustration --- */}
      <Box
        component={motion.div}
        animate={{ y: [0, -15, 0], rotate: [0, 1, -1, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          width: 320,
          height: 320,
          position: "relative",
          zIndex: 10,
          mb: 2,
        }}
      >
        <svg viewBox="0 0 300 300" width="100%" height="100%" style={{ overflow: "visible" }}>
          
          {/* Bóng đổ dưới đất */}
          <motion.ellipse 
            cx="150" cy="260" rx="60" ry="10" fill="#1565c0" opacity="0.1"
            animate={{ rx: [60, 40, 60], opacity: [0.1, 0.05, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Group chứa toàn bộ Máy bay + Ếch */}
          <g transform="translate(0, 10)">
            
            {/* 1. MÁY BAY GIẤY (Vẽ trước để làm nền) */}
            {/* Cánh sau bên trái (Tối hơn xíu để tạo khối) */}
            <path d="M150,160 L40,180 L150,240 Z" fill="#bbdefb" />
            
            {/* Thân chính máy bay (Màu trắng) */}
            <path d="M40,180 L260,180 L150,240 Z" fill="#e3f2fd" stroke="#90caf9" strokeWidth="1" />
            <path d="M40,180 L150,120 L260,180" fill="#fff" />
            <path d="M150,120 L150,240" stroke="#bbdefb" strokeWidth="2" /> {/* Nếp gấp giữa */}

            {/* 2. CHÚ ẾCH PHI CÔNG (Vẽ SAU để nằm ĐÈ LÊN máy bay) */}
            {/* Mình chỉnh tọa độ translate để ếch ngồi đúng chỗ nếp gấp */}
            <g transform="translate(130, 110)"> 
               
               {/* Chân sau (ngồi xổm) */}
               <ellipse cx="0" cy="55" rx="10" ry="15" fill="#22c55e" transform="rotate(-20)" />
               <ellipse cx="40" cy="55" rx="10" ry="15" fill="#22c55e" transform="rotate(20)" />

               {/* Thân */}
               <ellipse cx="20" cy="40" rx="25" ry="22" fill="#4ade80" />
               
               {/* Tay cầm lái (bám vào máy bay) */}
               <path d="M5,45 Q-5,60 10,65" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" fill="none" />
               <path d="M35,45 Q45,60 30,65" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" fill="none" />

               {/* Khăn quàng đỏ (Bay phấp phới) */}
               <path d="M-5,40 Q20,55 45,40" stroke="#f44336" strokeWidth="6" fill="none" />
               <motion.path 
                  d="M45,40 Q60,40 70,25" 
                  stroke="#ef5350" strokeWidth="5" fill="none" strokeLinecap="round"
                  animate={{ d: ["M45,40 Q60,40 70,25", "M45,40 Q60,50 75,35", "M45,40 Q60,40 70,25"] }} 
                  transition={{ duration: 0.3, repeat: Infinity }}
               />

               {/* Đầu */}
               <ellipse cx="20" cy="25" rx="22" ry="18" fill="#4ade80" />

               {/* Mắt & Kính phi công (Goggles) */}
               <circle cx="8" cy="15" r="10" fill="#fff" stroke="#166534" strokeWidth="1" />
               <circle cx="32" cy="15" r="10" fill="#fff" stroke="#166534" strokeWidth="1" />
               
               {/* Tròng kính xanh */}
               <circle cx="8" cy="15" r="7" fill="#29b6f6" opacity="0.8" />
               <circle cx="32" cy="15" r="7" fill="#29b6f6" opacity="0.8" />
               
               {/* Dây kính */}
               <path d="M-2,15 L-8,18" stroke="#374151" strokeWidth="3" />
               <path d="M42,15 L48,18" stroke="#374151" strokeWidth="3" />
               <path d="M15,15 L25,15" stroke="#374151" strokeWidth="2" />

               {/* Miệng cười tự tin */}
               <path d="M12,32 Q20,36 28,32" stroke="#064e3b" strokeWidth="2" fill="none" />
            </g>
            
            {/* Icon thư nhỏ xíu ở cánh (trang trí thêm) */}
            <g transform="translate(190, 185) skewX(-20) scale(0.6)">
                <rect width="30" height="20" rx="2" fill="#1976d2" />
                <path d="M0,0 L15,12 L30,0" stroke="#fff" strokeWidth="2" fill="none" />
            </g>

          </g>
        </svg>
      </Box>

      {/* --- Text Content --- */}
      <Box sx={{ zIndex: 10, textAlign: "center", maxWidth: "400px" }}>
        <Typography 
            variant="h5" 
            sx={{ fontWeight: 700, color: "#1565c0", mb: 1 }}
        >
          Sẵn sàng kết nối!
        </Typography>
        <Typography 
            variant="body1" 
            sx={{ color: "#546e7a", fontSize: "1rem" }}
        >
          Chọn một cuộc trò chuyện để bắt đầu chuyến bay.
        </Typography>
      </Box>
    </Box>
  );
}