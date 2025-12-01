import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Component bong bóng nước bay lên (trang trí)
const Bubble = ({ delay, x, size }) => (
  <motion.circle
    cx={x}
    cy="400"
    r={size}
    fill="rgba(255, 255, 255, 0.2)"
    animate={{
      cy: [400, 300],
      opacity: [0, 0.5, 0],
    }}
    transition={{
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      delay: delay,
      ease: "easeOut",
    }}
  />
);

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
        // Gradient nền trời chiều tà/bí ẩn
        background: "linear-gradient(180deg, #e0f7fa 0%, #80deea 100%)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Container của hình minh họa */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        sx={{
          width: { xs: 320, sm: 450, md: 550 },
          height: { xs: 280, sm: 380, md: 450 },
          mb: 4,
          position: "relative",
          zIndex: 2,
        }}
      >
        <svg
          viewBox="0 0 600 500"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="waterGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#4fc3f7" />
              <stop offset="100%" stopColor="#0288d1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* --- Background Scenery --- */}
          {/* Water Ripples */}
          <motion.ellipse
            cx="300"
            cy="420"
            rx="280"
            ry="60"
            fill="url(#waterGrad)"
            opacity="0.6"
            animate={{ rx: [280, 290, 280], ry: [60, 65, 60] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.ellipse
            cx="300"
            cy="420"
            rx="200"
            ry="40"
            fill="#81d4fa"
            opacity="0.4"
            animate={{ rx: [200, 210, 200], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />

          {/* Bubbles */}
          <Bubble delay={0} x={150} size={5} />
          <Bubble delay={1.5} x={450} size={8} />
          <Bubble delay={0.8} x={300} size={4} />

          {/* Lily Pad */}
          <motion.path
            d="M200,420 C200,380 400,380 400,420 C400,450 320,460 300,460 C280,460 200,450 200,420 Z"
            fill="#66bb6a"
            stroke="#2e7d32"
            strokeWidth="3"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M300,420 L350,380" // Detail cut on lily pad
            stroke="#2e7d32"
            strokeWidth="2"
            opacity="0.5"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* --- THE DETECTIVE FROG --- */}
          <motion.g
             animate={{ y: [0, 5, 0] }}
             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Body */}
            <ellipse cx="300" cy="380" rx="70" ry="60" fill="#43a047" />
            <path d="M250,420 Q300,450 350,420" fill="#2e7d32" opacity="0.2" /> {/* Belly shadow */}

            {/* Eyes Container */}
            <g>
                <circle cx="270" cy="340" r="20" fill="#fff" stroke="#1b5e20" strokeWidth="2" />
                <circle cx="330" cy="340" r="20" fill="#fff" stroke="#1b5e20" strokeWidth="2" />
                
                {/* Pupils moving left/right searching */}
                <motion.circle 
                    cx="270" cy="340" r="6" fill="#000" 
                    animate={{ cx: [265, 275, 265] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.circle 
                    cx="330" cy="340" r="6" fill="#000"
                    animate={{ cx: [325, 335, 325] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            </g>

            {/* Detective Hat (Sherlock Style) */}
            <path d="M240,330 Q300,300 360,330 L370,340 L230,340 Z" fill="#8d6e63" /> {/* Brim */}
            <path d="M250,330 Q300,280 350,330" fill="#795548" /> {/* Top */}
            <rect x="295" y="295" width="10" height="10" rx="2" fill="#5d4037" /> {/* Button */}

            {/* Hand holding Magnifying Glass */}
            <motion.g
                animate={{ rotate: [-15, 15, -15], x: [-20, 20, -20] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "300px 400px" }}
            >
                {/* Arm */}
                <path d="M340,400 Q360,400 380,380" stroke="#43a047" strokeWidth="12" strokeLinecap="round" fill="none" />
                
                {/* Magnifying Glass Handle */}
                <line x1="380" y1="380" x2="400" y2="360" stroke="#5d4037" strokeWidth="6" />
                
                {/* Glass Rim */}
                <circle cx="410" cy="350" r="25" fill="rgba(255,255,255,0.3)" stroke="#ffd54f" strokeWidth="4" />
                {/* Reflection on Glass */}
                <path d="M400,340 Q410,335 420,345" stroke="white" strokeWidth="2" opacity="0.6" fill="none" />
            </motion.g>

            {/* Mouth (Confused/Thinking) */}
            <path d="M285,390 Q300,385 315,390" stroke="#1b5e20" strokeWidth="3" fill="none" />
          </motion.g>

          {/* --- Floating "404" & "?" Bubbles popping up --- */}
          <motion.g
             animate={{ y: [0, -60], opacity: [0, 1, 0] }}
             transition={{ duration: 3, repeat: Infinity, delay: 0.5, ease: "easeOut" }}
          >
             <text x="390" y="340" fontSize="24" fontWeight="bold" fill="#01579b" opacity="0.7">?</text>
          </motion.g>

           <motion.g
             animate={{ y: [0, -80], opacity: [0, 1, 0] }}
             transition={{ duration: 4, repeat: Infinity, delay: 2, ease: "easeOut" }}
          >
             <text x="200" y="350" fontSize="30" fontWeight="bold" fill="#d32f2f" opacity="0.6">404</text>
          </motion.g>

        </svg>
      </Box>

      {/* Text Content */}
      <Box sx={{ zIndex: 2 }}>
        <Typography
            component={motion.h1}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            variant="h3"
            sx={{
            fontWeight: 900,
            background: "-webkit-linear-gradient(45deg, #0288d1 30%, #26c6da 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
            }}
        >
            404 - Page Not Found
        </Typography>

        <Typography
            component={motion.p}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            variant="h6"
            sx={{
            color: "text.secondary",
            maxWidth: 500,
            mb: 4,
            lineHeight: 1.6,
            }}
        >
            Thám tử Ếch đã lặn lội khắp hồ nhưng không tìm thấy trang bạn yêu cầu. 
            Có lẽ nó đã chìm xuống đáy hoặc chưa từng tồn tại.
        </Typography>

        <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
            sx={{
            borderRadius: "50px",
            px: 5,
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: "bold",
            textTransform: "none",
            bgcolor: "#0288d1",
            boxShadow: "0 8px 16px rgba(2, 136, 209, 0.24)",
            "&:hover": {
                bgcolor: "#0277bd",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 20px rgba(2, 136, 209, 0.32)",
            },
            transition: "all 0.3s ease",
            }}
        >
            Quay về trang chủ
        </Button>
      </Box>

        {/* Nền trang trí mờ ảo */}
        <Box sx={{ position: "absolute", bottom: -50, left: -50, width: 300, height: 300, background: "radial-gradient(circle, rgba(129, 212, 250, 0.4) 0%, transparent 70%)", borderRadius: "50%", zIndex: 1 }} />
        <Box sx={{ position: "absolute", top: -50, right: -50, width: 400, height: 400, background: "radial-gradient(circle, rgba(79, 195, 247, 0.3) 0%, transparent 70%)", borderRadius: "50%", zIndex: 1 }} />
    </Box>
  );
}