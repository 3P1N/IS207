import { motion } from "framer-motion";

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center gap-6">
        {/* Funny bouncing emoji */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl"
        >
          🐸
        </motion.div>

        {/* Spinning loader */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full"
        />

        {/* Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="text-xl font-semibold text-gray-700"
        >
          Đang tải... Chờ xíu nhé 😄
        </motion.p>
      </div>
    </div>
  );
}