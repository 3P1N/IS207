// LoadingPage.jsx
import React from "react";

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-4"></div>
      
      {/* Text */}
      <p className="text-gray-700 dark:text-gray-200 text-lg font-medium">
        Đang tải, vui lòng chờ...
      </p>
    </div>
  );
}
