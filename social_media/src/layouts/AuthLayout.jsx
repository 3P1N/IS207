import React from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { Box, Container, Typography, Link } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

// Cấu hình Animation chuyển trang
const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 }, // Hơi trượt từ dưới lên
  in: { opacity: 1, y: 0, scale: 1 },
  out: { opacity: 0, y: -20, scale: 0.98 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
};

export default function AuthLayout() {
  const { pathname } = useLocation();
  const element = useOutlet();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // Nền Gradient xanh mát mắt (Frog Theme)
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
        position: "relative",
        overflow: "hidden", // Giấu các phần tử bay nền
      }}
    >
      {/* Background Decor (Lá sen trôi / Đốm sáng) */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            background: "rgba(255, 255, 255, 0.4)",
            borderRadius: "50%",
            zIndex: 0,
          }}
          initial={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <Container maxWidth="xs" sx={{ position: "relative", zIndex: 1 }}>
        {/* AnimatePresence bọc Outlet để tạo hiệu ứng chuyển trang */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ width: "100%" }}
          >
            {element}
          </motion.div>
        </AnimatePresence>

        {/* Footer chung */}
        {/* <Box sx={{ mt: 3, textAlign: "center", opacity: 0.7 }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Frog Universe. Security by FrogGuard™
          </Typography>
        </Box> */}
      </Container>
    </Box>
  );
}