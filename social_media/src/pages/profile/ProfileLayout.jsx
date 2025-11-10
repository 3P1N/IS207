// src/layouts/ProfileLayout.jsx
import { Outlet, NavLink } from "react-router-dom";

import AvatarUser from "../../shared/components/AvatarUser";
export default function ProfileLayout() {
  return (
    <div className="profile-layout min-h-screen bg-gray-100">
      {/* Header profile */}
      <header className="bg-white shadow">
        {/* Cover */}
        <div className="h-40 w-full bg-gradient-to-r from-sky-500 to-indigo-500 relative">
          {/* Avatar */}
          <AvatarUser id="2" name="User" />
        </div>

        {/* Info + Nav tab */}
        <div className="pt-16 pb-4 flex flex-col items-center gap-2">
          {/* Tên + mô tả (tùy bạn lấy từ props/context) */}
          <div className="text-center">
            <h1 className="text-xl font-semibold">User Name</h1>
            <p className="text-sm text-gray-500">@username</p>
          </div>

          {/* Nav tab */}
          <nav className="mt-4 flex gap-4 border-b border-gray-200 w-full max-w-2xl justify-center">
            <NavLink
              to=""
              className={({ isActive }) =>
                `pb-2 text-sm font-medium ${
                  isActive
                    ? "border-b-2 border-sky-500 text-sky-600"
                    : "text-gray-500 hover:text-gray-800"
                }`
              }
            >
              Bài viết
            </NavLink>
            <NavLink
              to="ProfileAbout"
              className={({ isActive }) =>
                `pb-2 text-sm font-medium ${
                  isActive
                    ? "border-b-2 border-sky-500 text-sky-600"
                    : "text-gray-500 hover:text-gray-800"
                }`
              }
            >
              Giới thiệu
            </NavLink>
            <NavLink
              to="ProfileFriend"
              className={({ isActive }) =>
                `pb-2 text-sm font-medium ${
                  isActive
                    ? "border-b-2 border-sky-500 text-sky-600"
                    : "text-gray-500 hover:text-gray-800"
                }`
              }
            >
              Bạn bè
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Nội dung các tab */}
      <main className="max-w-3xl mx-auto mt-4 px-2 pb-8">
        <Outlet />
      </main>
    </div>
  );
}
