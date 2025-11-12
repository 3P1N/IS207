// src/layouts/ProfileLayout.jsx
import { Outlet, NavLink } from "react-router-dom";
import './profile.css'
import AvatarUser from "../../shared/components/AvatarUser";
export default function ProfileLayout() {
  return (
    <div className="profile-layout min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
        {/* Header profile */}
        <header className="relative">
          {/* Cover */}
          <div className="relative h-40 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500">
            {/* hiệu ứng ánh sáng nhẹ */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_55%)]" />

            {/* Avatar nổi giữa cover */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="relative">
                <div className="absolute inset-0 translate-y-2 rounded-full bg-sky-500/50 blur-xl" />
                <div className="relative rounded-full border-4 border-white bg-white p-1 shadow-xl">
                  <AvatarUser id="2" name="User" />
                </div>
              </div>
            </div>
          </div>

          {/* Info + Nav tab */}
          <div className="px-4 pt-16 pb-4 sm:px-8 flex flex-col items-center gap-3">
            {/* Tên + mô tả */}
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900">User Name</h1>
              <p className="text-sm text-gray-500">@username</p>
            </div>

            {/* Nav tab */}
            <nav className="mt-2 flex w-full max-w-xl justify-center gap-6 border-b border-gray-200 text-sm font-medium">
              <NavLink
                to=""
                end
                className={({ isActive }) =>
                  `relative pb-3 transition-colors ${isActive
                    ? "text-sky-600"
                    : "text-gray-500 hover:text-gray-800"
                  }`
                }
              >
                Bài viết
              </NavLink>
              <NavLink
                to="ProfileAbout"
                className={({ isActive }) =>
                  `relative pb-3 transition-colors ${isActive
                    ? "text-sky-600"
                    : "text-gray-500 hover:text-gray-800"
                  }`
                }
              >
                Giới thiệu
              </NavLink>
              <NavLink
                to="ProfileFriend"
                className={({ isActive }) =>
                  `relative pb-3 transition-colors ${isActive
                    ? "text-sky-600"
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
        <main className="max-w-3xl mx-auto mt-4 px-4 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );

}
