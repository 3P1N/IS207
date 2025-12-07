import React from 'react';

const Maintenance = () => {
  const handleReload = () => {
    window.location.reload();
  };

  // URL hình ảnh của bạn (Hãy thay thế link này bằng ảnh ếch tĩnh của bạn)
  // Ví dụ: '/images/static-frog.png' hoặc một URL online.
  // Ảnh nên là hình vuông để hiển thị tốt nhất trong khung tròn.
  const frogImageUrl = "/api/placeholder/200/200";

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-green-900 via-green-800 to-black flex items-center justify-center overflow-hidden font-sans text-white">

      {/* Background Decor: Floating Stars/Fireflies */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-green-400 rounded-full opacity-50 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 text-center px-6 max-w-lg mx-auto">

      

        {/* Text Content */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-300 tracking-tight">
          Hệ Thống Đang Ngủ Đông
        </h1>

        <p className="text-lg md:text-xl text-green-100/80 mb-8 leading-relaxed">
          Đội ngũ ếch thợ đang bận rộn bắt lỗi và nâng cấp hồ nước dữ liệu.
          <br className="hidden md:block"/>
          Vui lòng quay lại sau khi chúng tôi "ộp" xong nhé! 🐸
        </p>

        {/* Action Button */}
        <button
          onClick={handleReload}
          className="group relative inline-flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_30px_rgba(34,197,94,0.7)] transform hover:-translate-y-1"
        >
          <span>Thử lại ngay</span>
          {/* Refresh Icon */}
          <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Custom CSS for specific animations */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Maintenance;