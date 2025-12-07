// src/components/skeleton/ThreadPageSkeleton.jsx
import React from "react";

export default function ThreadPageSkeleton() {
  return (
    <div className="flex flex-col h-full w-full bg-white animate-pulse">
      
      {/* --- HEADER SKELETON --- */}
      <div className="h-16 border-b border-gray-100 flex items-center px-4 gap-3 shrink-0">
        <div className="w-10 h-10 bg-gray-200 rounded-full" /> {/* Back Button hoặc Avatar */}
        <div className="flex flex-col gap-2">
          <div className="h-4 bg-gray-200 rounded w-32" /> {/* Tên */}
          <div className="h-3 bg-gray-200 rounded w-20" /> {/* Active status */}
        </div>
        <div className="ml-auto w-8 h-8 bg-gray-200 rounded-full" /> {/* Info button */}
      </div>

      {/* --- MESSAGE BODY SKELETON --- */}
      <div className="flex-1 p-4 space-y-6 overflow-hidden flex flex-col justify-end">
        {/* Tin nhắn từ NGƯỜI KHÁC (Bên trái) */}
        <div className="flex gap-2 items-end">
          <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
          <div className="h-10 bg-gray-200 rounded-2xl rounded-bl-none w-2/3" />
        </div>

        {/* Tin nhắn từ MÌNH (Bên phải) */}
        <div className="flex gap-2 items-end justify-end">
           <div className="h-12 bg-gray-300 rounded-2xl rounded-br-none w-1/2" />
        </div>

        {/* Tin nhắn từ NGƯỜI KHÁC (Ngắn) */}
        <div className="flex gap-2 items-end">
          <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
          <div className="h-8 bg-gray-200 rounded-2xl rounded-bl-none w-1/3" />
        </div>

        {/* Tin nhắn từ MÌNH (Dài) */}
        <div className="flex gap-2 items-end justify-end">
           <div className="h-20 bg-gray-300 rounded-2xl rounded-br-none w-3/4" />
        </div>
         
         {/* Tin nhắn từ MÌNH (Mới nhất) */}
        <div className="flex gap-2 items-end justify-end">
           <div className="h-8 bg-gray-300 rounded-2xl rounded-br-none w-1/4" />
        </div>
      </div>

      {/* --- FOOTER INPUT SKELETON --- */}
      <div className="h-16 border-t border-gray-100 flex items-center px-4 gap-3 shrink-0">
        <div className="w-8 h-8 bg-gray-200 rounded-full" /> {/* Icon upload ảnh */}
        <div className="flex-1 h-10 bg-gray-200 rounded-full" /> {/* Input text */}
        <div className="w-8 h-8 bg-gray-200 rounded-full" /> {/* Icon send */}
      </div>

    </div>
  );
}