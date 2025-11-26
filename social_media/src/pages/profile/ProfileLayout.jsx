// src/layouts/ProfileLayout.jsx
import { Outlet, NavLink, useParams } from "react-router-dom";
import AvatarUser from "../../shared/components/AvatarUser";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";
import { useQuery } from "@tanstack/react-query";
export default function ProfileLayout() {
  const { userData } = useContext(AuthContext);
  const { id } = useParams(); // /profile/:id hoặc /profile

  // Nếu không có id (vd: /profile) thì dùng id của chính mình
  const profileId = id ?? userData?.id;

  // Xác định có phải đang xem profile của chính mình không
  const isOwnProfile = String(userData?.id) === String(profileId);

  const {
    data: profileUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profileUser", profileId],
    enabled: !!profileId, // chỉ chạy khi đã có profileId
    queryFn: async () => {
      // Nếu là trang của chính mình và đã có userData thì xài luôn
      if (isOwnProfile && userData) {
        return userData;
      }

      // Còn lại gọi API
      const res = await api.get(`/users/${profileId}`);
      return res.data.user || res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Đang tải trang cá nhân...
      </div>
    );
  }

  if (isError || !profileUser) {
    return (
      <div className="p-4 text-sm text-red-500">
        Không tìm thấy trang cá nhân.
      </div>
    );
  }

  const showSuggestTab = isOwnProfile;
  const showAddFriendButton = !isOwnProfile;

  return (
    <ProfileShell
      key={profileUser?.id}
      profileUser={profileUser}
      showSuggestTab={showSuggestTab}
      showAddFriendButton={showAddFriendButton}
      isOwnProfile={isOwnProfile}
    />
  );
}


function ProfileShell({
  profileUser,
  showSuggestTab,
  showAddFriendButton,
  isOwnProfile,
}) {
  return (
    <div className="profile-layout">
      <div className="profile-card">
        {/* Header profile */}
        <header className="relative">
          {/* Cover */}
          <div className="profile-cover">
          <AvatarUser userData={profileUser} />
            
          </div>

          {/* Info + Nav tab */}
          <div className="px-4 pt-16 pb-4 sm:px-8 flex flex-col items-center gap-3">
            {/* Tên + mô tả + nút Add friend (nếu là người khác) */}
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                {profileUser?.name || "User Name"}
              </h1>
              <p className="text-sm text-gray-500">
                {/* model User của bạn không có username, nên fallback email */}
                {profileUser?.username
                  ? `@${profileUser.username}`
                  : profileUser?.email || "@username"}
              </p>

              {showAddFriendButton && (
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-gray-800 active:scale-[0.98] transition"
                >
                  Thêm bạn bè
                </button>
              )}
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

              {/* Chỉ trang của mình mới có tab Gợi ý kết bạn */}
              {showSuggestTab && (
                <NavLink
                  to="ProfileSuggest"
                  className={({ isActive }) =>
                    isActive ? "profile-tab-link active" : "profile-tab-link"
                  }
                >
                  Gợi ý kết bạn
                </NavLink>
              )}
            </nav>
          </div>
        </header>

        {/* Nội dung các tab */}
        <main className="max-w-3xl mx-auto mt-4 px-4 pb-8">
          {/* Truyền profileUser + isOwnProfile xuống cho các tab con */}
          <Outlet context={{ profileUser, isOwnProfile }}/>
        </main>
      </div>
    </div>
  );
}
