// src/layouts/ProfileLayout.jsx
import { Outlet, NavLink, useParams } from "react-router-dom";
import AvatarUser from "../../shared/components/AvatarUser";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";

export default function ProfileLayout() {
  const { userData, token } = useContext(AuthContext);
  const { id } = useParams(); // /profile/:id

  // nếu không có id (vd: /profile) thì coi là trang của chính mình
  const isOwnProfile = !id || String(userData?.id) === String(id);

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // nếu chưa có id và cũng chưa có userData thì khỏi làm gì
    if (!id && !userData) return;

    const fetchProfile = async () => {
      // CASE 1: trang cá nhân của chính mình -> dùng luôn userData
      if (isOwnProfile) {
        setProfileUser(userData || null);
        setLoading(false);
        return;
      }

      // CASE 2: trang cá nhân người khác -> gọi API theo id trên URL
      try {
        setLoading(true);
        const res = await api.get(`/users/${id}`);
        setProfileUser(res.data.user || res.data);
        console.log("Fetched user from backend:", res.data);
      } catch (err) {
        console.error("Fetch user error:", err);
        setProfileUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, isOwnProfile, userData, token]);

  if (loading || !profileUser) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Đang tải trang cá nhân...
      </div>
    );
  }

  const showSuggestTab = isOwnProfile;
  const showAddFriendButton = !isOwnProfile;

  return (
    <ProfileShell
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
            <div className="profile-cover-glow" />

            {/* Avatar nổi giữa cover */}
            <div className="profile-avatar-container">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar-glow" />
                <div className="profile-avatar-frame">
                  <AvatarUser userData={profileUser} />
                </div>
              </div>
            </div>
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
          <Outlet context={{ profileUser, isOwnProfile }} />
        </main>
      </div>
    </div>
  );
}
