// src/components/post/PostSkeleton.jsx
import React from "react";

const PostSkeleton = () => {
  return (
    <div className="w-full max-w-xl bg-white rounded-lg shadow p-4 mb-4 border border-gray-100 animate-pulse">
      {/* Header: Avatar + Tên */}
      <div className="flex items-center space-x-3 mb-4">
        {/* Avatar tròn */}
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          {/* Tên User */}
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          {/* Thời gian */}
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>

      {/* Content: Các dòng text */}
      <div className="space-y-3 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      </div>

      {/* Image Placeholder (giả lập ảnh bài viết) */}
      <div className="h-64 bg-gray-200 rounded w-full mb-4"></div>

      {/* Footer: Action buttons (Like, Comment, Share) */}
      <div className="flex justify-between pt-2 border-t border-gray-100">
        <div className="h-8 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
};

export default PostSkeleton;