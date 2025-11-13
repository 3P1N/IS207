// src/layouts/ProfileLayout.jsx
import { Outlet, NavLink } from "react-router-dom";
import './profile.css'
import AvatarUser from "../../shared/components/AvatarUser";
export default function ProfileLayout() {
  return (
    <div className="profile-layout">
      <div className="profile-card">
        {/* Header profile */}
        <header className="relative">
          {/* Cover */}
          <div className="profile-cover">
            {/* hiệu ứng ánh sáng nhẹ */}
            <div className="profile-cover-glow" />

            {/* Avatar nổi giữa cover */}
            <div className="profile-avatar-container">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar-glow" />
                <div className="profile-avatar-frame">
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
            <nav className="profile-tabs">
              <NavLink
                to=""
                end
                className={({ isActive }) =>
                  isActive ? "profile-tab-link active" : "profile-tab-link"
                }
              >
                Bài viết
              </NavLink>

              <NavLink
                to="ProfileAbout"
                className={({ isActive }) =>
                  isActive ? "profile-tab-link active" : "profile-tab-link"
                }
              >
                Giới thiệu
              </NavLink>

              <NavLink
                to="ProfileFriend"
                className={({ isActive }) =>
                  isActive ? "profile-tab-link active" : "profile-tab-link"
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
