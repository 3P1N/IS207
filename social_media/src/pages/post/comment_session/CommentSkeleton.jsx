import React from "react";

const CommentSkeleton = () => {
  return (
    <div className="flex gap-2 w-full animate-pulse mb-4">
      {/* 1. Avatar nhỏ bên trái */}
      <div className="shrink-0 w-8 h-8 bg-gray-200 rounded-full"></div>

      <div className="flex flex-col flex-1 max-w-[80%]">
        {/* 2. Khối nội dung (Bubble) */}
        <div className="bg-gray-100 rounded-2xl p-3 w-full border border-gray-50">
            {/* Tên người dùng */}
            <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
            
            {/* Nội dung comment (2 dòng) */}
            <div className="h-3 bg-gray-200 rounded w-full mb-1.5"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* 3. Footer Actions (Like . Reply . Time) */}
        <div className="flex gap-3 ml-3 mt-1.5">
            <div className="h-2.5 bg-gray-200 rounded w-8"></div>
            <div className="h-2.5 bg-gray-200 rounded w-8"></div>
            <div className="h-2.5 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton;