import React from "react";
import { motion } from "framer-motion";

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 overflow-hidden relative font-sans">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-emerald-100 z-0" />
      
      {/* Background Decor: Ripples (Gợn sóng lan tỏa) */}
      <motion.div
        className="absolute w-[500px] h-[500px] border-2 border-green-200 rounded-full z-0 opacity-0"
        animate={{ scale: [0.5, 1.5], opacity: [0.6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] border-2 border-green-300 rounded-full z-0 opacity-0"
        animate={{ scale: [0.5, 1.5], opacity: [0.6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1 }}
      />

      {/* --- Main Illustration --- */}
      <div className="relative z-10 w-64 h-64 flex items-center justify-center">
        
        {/* Container for Orbiting Fly (The Spinner) */}
        <motion.div
          className="absolute inset-0 z-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          {/* The Fly/Dragonfly */}
          <motion.div 
            className="absolute top-0 left-1/2 -ml-3 -mt-6"
            style={{ transformOrigin: "center center" }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" className="drop-shadow-sm">
                <path d="M20 20 L5 10 Q10 5 20 15 Z" fill="#a7f3d0" stroke="#059669" strokeWidth="1" opacity="0.8"/> {/* Left Wing */}
                <path d="M20 20 L35 10 Q30 5 20 15 Z" fill="#a7f3d0" stroke="#059669" strokeWidth="1" opacity="0.8"/> {/* Right Wing */}
                <circle cx="20" cy="20" r="3" fill="#047857" /> {/* Body */}
            </svg>
          </motion.div>
          
          {/* Motion trail (optional subtle ring) */}
          <div className="absolute inset-4 rounded-full border border-dashed border-green-300/50"></div>
        </motion.div>

        {/* The Frog */}
        <svg
          viewBox="0 0 200 180"
          className="w-full h-full drop-shadow-xl"
        >
          {/* Lily Pad */}
          <motion.path
            d="M20,140 C20,80 180,80 180,140 C180,170 120,180 100,180 C80,180 20,170 20,140 Z"
            fill="#4ade80"
            stroke="#166534"
            strokeWidth="3"
            initial={{ scale: 0.9 }}
            animate={{ scale: [0.95, 1, 0.95] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <path d="M100,140 L160,100" stroke="#166534" strokeWidth="2" opacity="0.3" /> {/* Leaf detail */}

          {/* Frog Body */}
          <g>
             <ellipse cx="100" cy="110" rx="60" ry="45" fill="#22c55e" />
             <path d="M60 140 Q100 160 140 140" fill="#15803d" opacity="0.2" /> {/* Shadow */}
          </g>

          {/* Eyes Group - Rotating to follow the fly */}
          <g>
            {/* Eye Backgrounds */}
            <circle cx="75" cy="70" r="20" fill="#fff" stroke="#14532d" strokeWidth="2" />
            <circle cx="125" cy="70" r="20" fill="#fff" stroke="#14532d" strokeWidth="2" />

            {/* Pupils Group - Rotating logic */}
            <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ originX: "100px", originY: "110px" }} // Rotate around center of frog roughly
            >
                {/* We offset pupils so they rotate inside the eye circles */}
                {/* This is a trick: we rotate the whole group, but positioning needs to be precise relative to rotation center */}
                {/* Simple approach: Use separate transforms for pupils based on same timing */}
            </motion.g>
            
            {/* Simpler Pupil Animation: Just orbit small circles inside the eyes */}
             <circle cx="75" cy="70" r="20" fill="transparent" /> 
             <motion.circle 
                cx="75" cy="70" r="6" fill="#000"
                animate={{ translateX: [0, 8, 0, -8, 0], translateY: [-8, 0, 8, 0, -8] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", times: [0, 0.25, 0.5, 0.75, 1] }}
             />
             <motion.circle 
                cx="125" cy="70" r="6" fill="#000"
                animate={{ translateX: [0, 8, 0, -8, 0], translateY: [-8, 0, 8, 0, -8] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", times: [0, 0.25, 0.5, 0.75, 1] }}
             />
          </g>

          {/* Smile */}
          <path d="M85 120 Q100 125 115 120" stroke="#064e3b" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* --- Text Content --- */}
      <div className="flex flex-col items-center mt-8 z-10">
        <h2 className="text-2xl font-bold text-green-800 mb-2">
            Đang bắt dữ liệu...
        </h2>
        <div className="flex space-x-1">
            <motion.div
              className="w-3 h-3 bg-green-500 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-3 h-3 bg-green-600 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-3 h-3 bg-green-700 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
        </div>
        <p className="text-green-600/70 text-sm mt-4 font-medium">
            Vui lòng chờ trong giây lát
        </p>
      </div>

    </div>
  );
}