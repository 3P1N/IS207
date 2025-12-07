// src/components/skeleton/ThreadListSkeleton.jsx
import React from "react";

const ThreadItemSkeleton = () => (
  <div className="flex items-center gap-3 p-3 w-full animate-pulse hover:bg-gray-50 rounded-lg">
    {/* Avatar Skeleton */}
    <div className="shrink-0 w-12 h-12 bg-gray-200 rounded-full" />

    {/* Content Skeleton */}
    <div className="flex-1 min-w-0 space-y-2">
      <div className="flex justify-between items-center">
        {/* Tên User */}
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        {/* Thời gian (nhỏ ở góc) */}
        <div className="h-3 bg-gray-200 rounded w-10" />
      </div>
      {/* Tin nhắn cuối (độ dài ngẫu nhiên cho tự nhiên) */}
      <div className="h-3 bg-gray-200 rounded w-3/4" />
    </div>
  </div>
);

export default function ThreadListSkeleton({ count = 6 }) {
  return (
    <div className="w-full flex flex-col gap-1 p-2">
      {Array(count).fill(0).map((_, index) => (
        <ThreadItemSkeleton key={index} />
      ))}
    </div>
  );
}