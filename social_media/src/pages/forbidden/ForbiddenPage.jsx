import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Icon ổ khóa bay nền
const FloatingLock = ({ delay, x, y, size }) => (
  <motion.div
    className="absolute text-red-200/20 z-0 pointer-events-none"
    style={{ left: x, top: y }}
    animate={{
      y: [0, -20, 0],
      opacity: [0.1, 0.3, 0.1],
      rotate: [0, 10, -10, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm4 10.723V20h-2v-2.277a1.993 1.993 0 0 1 .567-3.677A2.001 2.001 0 0 1 14 16a1.99 1.99 0 0 1-1 1.723z" />
    </svg>
  </motion.div>
);

export default function ForbiddenPage({
  title = "403 — Restricted Area",
  message = "Hồ này có bảo vệ! Bạn không có quyền bơi ở đây.",
  returnTo = "/",
}) {
  // State để theo dõi vị trí chuột (để mắt ếch nhìn theo)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Tính toán vị trí tương đối (-1 đến 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // Nhân hệ số để mắt di chuyển
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 overflow-hidden relative px-6 font-sans">
      
      {/* --- Background Elements --- */}
      {/* Spotlight Effect - Ánh sáng đèn pin */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-green-900/40 z-0" />
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_50%)] animate-pulse pointer-events-none" />
      
      {/* Floating Locks */}
      <FloatingLock delay={0} x="10%" y="20%" size={40} />
      <FloatingLock delay={1.5} x="80%" y="15%" size={60} />
      <FloatingLock delay={0.5} x="20%" y="70%" size={30} />
      <FloatingLock delay={2} x="85%" y="80%" size={50} />


      {/* --- Main Content Card --- */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative z-10 text-center max-w-lg w-full p-10 bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl"
      >
        {/* Warning Badge */}
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-6 ring-1 ring-red-500/50"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        </motion.div>

        <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
          {title}
        </h1>
        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
          {message}
        </p>

        <Link
          to={returnTo}
          className="group relative inline-flex items-center justify-center px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-500 transition-all duration-300 overflow-hidden"
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
          <span className="relative flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Quay về nơi an toàn
          </span>
        </Link>
      </motion.div>


      {/* --- The Security Frog --- */}
      <motion.div
        className="relative mt-12 z-10"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="180"
          height="160"
          viewBox="0 0 200 180"
          className="drop-shadow-2xl"
        >
          {/* Group Frog to float slightly */}
          <g className="animate-[bounce_3s_infinite]">
            
            {/* Body */}
            <ellipse cx="100" cy="130" rx="70" ry="50" fill="#4ade80" stroke="#166534" strokeWidth="3" />
            <path d="M70 160 Q100 180 130 160" fill="#22c55e" opacity="0.5" /> {/* Belly shadow */}

            {/* Eyes Container - Moves slightly opposite to mouse for parallax */}
            <g>
              {/* Left Eye Ball */}
              <circle cx="70" cy="90" r="25" fill="#fff" stroke="#166534" strokeWidth="2" />
              {/* Right Eye Ball */}
              <circle cx="130" cy="90" r="25" fill="#fff" stroke="#166534" strokeWidth="2" />
              
              {/* Pupils - Moving with Mouse Logic */}
              <circle 
                cx={70 + mousePosition.x * 0.3} 
                cy={90 + mousePosition.y * 0.3} 
                r="8" fill="#0f172a" 
              />
              <circle 
                cx={130 + mousePosition.x * 0.3} 
                cy={90 + mousePosition.y * 0.3} 
                r="8" fill="#0f172a" 
              />
              
              {/* Eyelids (Blinking animation via CSS/Framer implied or added simply here) */}
               <motion.path 
                d="M45 80 Q70 60 95 80" 
                fill="#4ade80" 
                stroke="#166534" 
                strokeWidth="2"
                animate={{ d: ["M45 80 Q70 60 95 80", "M45 90 Q70 110 95 90", "M45 80 Q70 60 95 80"] }}
                transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.2 }}
               />
               <motion.path 
                d="M105 80 Q130 60 155 80" 
                fill="#4ade80" 
                stroke="#166534" 
                strokeWidth="2"
                animate={{ d: ["M105 80 Q130 60 155 80", "M105 90 Q130 110 155 90", "M105 80 Q130 60 155 80"] }}
                transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.2 }}
               />
            </g>

            {/* Security Cap */}
            <path d="M50 75 L150 75 L140 40 L60 40 Z" fill="#1e293b" /> {/* Cap base */}
            <path d="M40 75 L160 75 Q100 95 40 75" fill="#0f172a" /> {/* Visor */}
            <rect x="92" y="45" width="16" height="20" rx="4" fill="#fbbf24" /> {/* Badge */}
            
            {/* Mouth - Stern Look */}
            <path d="M85 140 Q100 135 115 140" stroke="#064e3b" strokeWidth="3" fill="none" />

            {/* Hand Holding Stop Sign */}
             <g transform="translate(140, 100) rotate(-10)">
                <line x1="0" y1="0" x2="0" y2="60" stroke="#884020" strokeWidth="6" />
                <circle cx="0" cy="0" r="30" fill="#ef4444" stroke="#fff" strokeWidth="3" />
                <rect x="-20" y="-5" width="40" height="10" fill="#fff" />
             </g>
          </g>
        </svg>

        {/* Shadow under frog */}
        <div className="w-40 h-4 bg-black/40 blur-md rounded-[100%] absolute bottom-[-10px] left-10 z-0"></div>
      </motion.div>
      
      {/* Footer */}
      <div className="absolute bottom-4 text-xs text-slate-500 font-mono">
        ERROR CODE: 403_ACCESS_DENIED
      </div>
    </div>
  );
}