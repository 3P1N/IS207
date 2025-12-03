import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { motion, useAnimation } from "framer-motion";

export default function FrogAvatar({ focusedField, valueLength = 0, showPassword }) {
  const eyesAnim = useAnimation();
  const leftHandAnim = useAnimation();
  const rightHandAnim = useAnimation();

  // Xác định trạng thái
  const isPasswordType = focusedField === "password" || focusedField === "confirm_password" || focusedField === "password_confirmation";
  const handsUp = isPasswordType && !showPassword;
  
  // Tính toán vị trí con ngươi (Pupil) dựa trên độ dài text input
  // Giới hạn di chuyển từ -10px đến 10px
  const pupilX = focusedField && !isPasswordType 
    ? Math.min(Math.max(valueLength * 1.2 - 10, -10), 10) 
    : 0;

  useEffect(() => {
    // Xử lý tay (Hands)
    if (handsUp) {
      leftHandAnim.start({ y: 0, x: 0, transition: { type: "spring", stiffness: 180, damping: 13 } });
      rightHandAnim.start({ y: 0, x: 0, transition: { type: "spring", stiffness: 180, damping: 13 } });
    } else {
      leftHandAnim.start({ y: 120, x: 0, transition: { duration: 0.25 } });
      rightHandAnim.start({ y: 120, x: 0, transition: { duration: 0.25 } });
    }

    // Xử lý mắt (Eyes) khi Show Password hoặc Focus thường
    const handleEyes = async () => {
      if (showPassword && isPasswordType) {
        // Mắt mở to ngạc nhiên khi show pass
        await eyesAnim.start({ scale: 1.2, transition: { type: "spring", stiffness: 300 } });
      } else {
        // Trạng thái bình thường
        await eyesAnim.start({ scale: 1, transition: { duration: 0.2 } });
      }
    };
    handleEyes();

  }, [handsUp, showPassword, isPasswordType, leftHandAnim, rightHandAnim, eyesAnim]);

  // Hiệu ứng chớp mắt tự động (Blink)
  useEffect(() => {
    const blinkInterval = setInterval(async () => {
      if (handsUp || (showPassword && isPasswordType)) return;
      await eyesAnim.start({ scaleY: 0.1, transition: { duration: 0.1 } });
      await eyesAnim.start({ scaleY: 1, transition: { duration: 0.15 } });
    }, Math.random() * 4000 + 2000);
    return () => clearInterval(blinkInterval);
  }, [handsUp, showPassword, isPasswordType, eyesAnim]);

  return (
    <Box sx={{ width: 140, height: 120, mb: -4, zIndex: 10, position: 'relative' }}>
      <svg viewBox="0 0 120 120" width="100%" height="100%" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="3" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Nhóm chính */}
        <g filter="url(#shadow)">
            {/* THÂN ẾCH (Body) */}
            <path d="M20,110 C20,50 100,50 100,110 Z" fill="url(#bodyGradient)" stroke="#15803d" strokeWidth="2" />
            
            {/* BỤNG (Belly Patch) */}
            <ellipse cx="60" cy="110" rx="25" ry="15" fill="#dcfce7" opacity="0.6" />

            {/* ĐẦU (Head - gộp chung body style nhưng vẽ riêng để layer mắt) */}
            <ellipse cx="60" cy="70" rx="50" ry="40" fill="url(#bodyGradient)" stroke="#15803d" strokeWidth="2" />
            
            {/* MÁ HỒNG (Blush) */}
            <motion.circle cx="25" cy="80" r="6" fill="#fca5a5" opacity="0.6" animate={{ opacity: handsUp ? 0 : 0.6 }} />
            <motion.circle cx="95" cy="80" r="6" fill="#fca5a5" opacity="0.6" animate={{ opacity: handsUp ? 0 : 0.6 }} />

            {/* MẮT (Eyes Group) */}
            <motion.g animate={eyesAnim} style={{ originX: "60px", originY: "50px" }}>
                {/* Mắt trái */}
                <g transform="translate(-20, 0)">
                    <circle cx="60" cy="50" r="14" fill="#fff" stroke="#15803d" strokeWidth="2" />
                    <motion.circle cx="60" cy="50" r="5" fill="#0f172a" animate={{ x: pupilX }} />
                    <circle cx="57" cy="47" r="2.5" fill="#fff" opacity="0.9" />
                </g>
                {/* Mắt phải */}
                <g transform="translate(20, 0)">
                    <circle cx="60" cy="50" r="14" fill="#fff" stroke="#15803d" strokeWidth="2" />
                    <motion.circle cx="60" cy="50" r="5" fill="#0f172a" animate={{ x: pupilX }} />
                    <circle cx="57" cy="47" r="2.5" fill="#fff" opacity="0.9" />
                </g>
            </motion.g>

            {/* MIỆNG (Mouth) */}
            <motion.path 
                d="M48 85 Q60 95 72 85" 
                stroke="#15803d" strokeWidth="3" fill="none" strokeLinecap="round" 
                animate={{ d: handsUp ? "M52 85 Q60 85 68 85" : (showPassword && isPasswordType ? "M50 88 Q60 100 70 88" : "M48 85 Q60 95 72 85") }}
            />

            {/* TAY (Hands - Paws) */}
            <motion.g initial={{ y: 120 }} animate={leftHandAnim}>
                <circle cx="35" cy="95" r="12" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
                <circle cx="25" cy="90" r="4" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
                <circle cx="35" cy="82" r="4" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
                <circle cx="45" cy="90" r="4" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
            </motion.g>

            <motion.g initial={{ y: 120 }} animate={rightHandAnim}>
                <circle cx="85" cy="95" r="12" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
                <circle cx="75" cy="90" r="4" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
                <circle cx="85" cy="82" r="4" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
                <circle cx="95" cy="90" r="4" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
            </motion.g>
        </g>
      </svg>
    </Box>
  );
}