// src/pages/NotFoundPage.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

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
        bgcolor: "background.default",
      }}
    >
      {/* Illustration container */}
      <Box
        sx={{
          width: { xs: 260, sm: 360, md: 440 },
          height: { xs: 220, sm: 300, md: 360 },
          mb: 4,
          position: "relative",
          pointerEvents: "none",
          // overall fade/slide-in
          animation: "fadeInUp 560ms ease",
          "@keyframes fadeInUp": {
            from: { opacity: 0, transform: "translateY(18px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
        aria-hidden
      >
        {/* SVG illustration */}
        <svg
          viewBox="0 0 600 480"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#8ec5ff" />
              <stop offset="100%" stopColor="#a0c4ff" />
            </linearGradient>
            <linearGradient id="g2" x1="0" x2="1">
              <stop offset="0%" stopColor="#ffd6a5" />
              <stop offset="100%" stopColor="#ffaaa7" />
            </linearGradient>
            <filter id="f1" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="10" stdDeviation="18" floodColor="#000" floodOpacity="0.06" />
            </filter>
          </defs>

          {/* background blob */}
          <g transform="translate(300,220)">
            <g style={{ animation: "floatSlow 6s ease-in-out infinite" }}>
              <path
                d="M-220,-40 C-180,-140 60,-160 140,-90 C240,-0 200,140 80,170 C-40,200 -170,150 -220,60 C-270,-30 -260,20 -220,-40 Z"
                fill="url(#g1)"
                filter="url(#f1)"
                opacity="0.95"
              />
            </g>

            {/* small accent blob */}
            <g style={{ animation: "float 4.5s ease-in-out infinite", transformOrigin: "60px 60px" }}>
              <ellipse cx="160" cy="-120" rx="50" ry="32" fill="url(#g2)" opacity="0.95" />
            </g>

            {/* robot / character */}
            <g style={{ animation: "sway 3.2s ease-in-out infinite", transformOrigin: "0px 0px" }}>
              {/* body */}
              <rect x="-70" y="-20" rx="22" ry="22" width="160" height="160" fill="#ffffff" stroke="#e6eefc" strokeWidth="6" filter="url(#f1)" />
              {/* eyes */}
              <g transform="translate(-30,30)" style={{ animation: "blink 4s step-end infinite" }}>
                <circle cx="0" cy="10" r="10" fill="#243b55" />
                <circle cx="60" cy="10" r="10" fill="#243b55" />
              </g>
              {/* mouth */}
              <rect x="-10" y="80" width="20" height="6" rx="3" fill="#c0d2ff" />
              {/* arm left */}
              <g transform="translate(-100,40)" style={{ animation: "wave 1.6s ease-in-out infinite", transformOrigin: "110px 60px" }}>
                <rect x="0" y="0" rx="10" ry="10" width="24" height="64" fill="#fff" stroke="#e6eefc" strokeWidth="4" />
              </g>
              {/* arm right */}
              <rect x="76" y="40" rx="10" ry="10" width="24" height="64" fill="#fff" stroke="#e6eefc" strokeWidth="4" />
              {/* badge 404 */}
              <g transform="translate(-40,-70)">
                <rect x="0" y="-14" rx="10" ry="10" width="100" height="36" fill="#fff" stroke="#dbe9ff" strokeWidth="3" />
                <text x="50" y="12" fontSize="18" fontWeight="700" textAnchor="middle" fill="#1e3a8a">404</text>
              </g>
            </g>

            {/* confetti pieces */}
            <g>
              <rect x="-220" y="-140" width="8" height="18" rx="2" style={{ transformOrigin: "0 0", animation: "confetti1 3.5s linear infinite" }} fill="#ffd166" />
              <rect x="220" y="-100" width="8" height="18" rx="2" style={{ transformOrigin: "0 0", animation: "confetti2 4.2s linear infinite" }} fill="#06d6a0" />
              <rect x="120" y="40" width="8" height="18" rx="2" style={{ transformOrigin: "0 0", animation: "confetti3 3.8s linear infinite" }} fill="#ef476f" />
              <rect x="-80" y="120" width="8" height="18" rx="2" style={{ transformOrigin: "0 0", animation: "confetti4 4.6s linear infinite" }} fill="#118ab2" />
            </g>
          </g>

          {/* Keyframe styles inside SVG via style tag */}
          <style>{`
            @keyframes floatSlow {
              0% { transform: translateY(0) }
              50% { transform: translateY(-12px) }
              100% { transform: translateY(0) }
            }
            @keyframes float {
              0% { transform: translateY(0) translateX(0) }
              50% { transform: translateY(-8px) translateX(6px) }
              100% { transform: translateY(0) translateX(0) }
            }
            @keyframes sway {
              0% { transform: rotate(-3deg) }
              50% { transform: rotate(3deg) }
              100% { transform: rotate(-3deg) }
            }
            @keyframes blink {
              0%, 92% { transform: scaleY(1) }
              94% { transform: scaleY(0.1) }
              96% { transform: scaleY(1) }
              100% { transform: scaleY(1) }
            }
            @keyframes wave {
              0% { transform: rotate(0deg) }
              50% { transform: rotate(-25deg) }
              100% { transform: rotate(0deg) }
            }
            @keyframes confetti1 {
              0% { transform: translateY(-20px) rotate(0deg) }
              100% { transform: translateY(260px) rotate(360deg) }
            }
            @keyframes confetti2 {
              0% { transform: translateY(-10px) rotate(0deg) }
              100% { transform: translateY(300px) rotate(-360deg) }
            }
            @keyframes confetti3 {
              0% { transform: translateY(-60px) rotate(0deg) }
              100% { transform: translateY(240px) rotate(270deg) }
            }
            @keyframes confetti4 {
              0% { transform: translateY(-30px) rotate(0deg) }
              100% { transform: translateY(280px) rotate(420deg) }
            }
          `}</style>
        </svg>
      </Box>

      {/* Texts */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: "text.primary",
          mb: 1,
          letterSpacing: "-0.02em",
        }}
      >
        404 Not Found
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 1.5, color: "text.secondary", maxWidth: 560 }}>
        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
      </Typography>

      <Button
        component={Link}
        to="/"
        variant="contained"
        size="large"
        sx={{
          fontWeight: 700,
          px: 3,
          py: 1.1,
          borderRadius: "12px",
          textTransform: "none",
          boxShadow: 3,
          // gentle hover lift
          transition: "transform 160ms ease, box-shadow 160ms ease",
          ":hover": { transform: "translateY(-3px)", boxShadow: 6 },
        }}
      >
        Back to Home
      </Button>
    </Box>
  );
}
