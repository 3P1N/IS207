import { Outlet, NavLink, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

// Import các thành phần từ dự án của bạn
import AvatarUser from "../../shared/components/AvatarUser";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";
// Import ImageViewer
import ImageViewer from "../../shared/components/ImageViewer";

export default function ProfileLayout() {
  const { userData, setUserData } = useContext(AuthContext);
  const { id } = useParams();
  const queryClient = useQueryClient();

  // State loading cho việc upload avatar
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

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
    enabled: !!profileId,
    queryFn: async () => {
      // Nếu là trang của chính mình và đã có userData thì ưu tiên dùng userData
      if (isOwnProfile && userData) {
        return userData;
      }
      const res = await api.get(`/users/${profileId}`);
      return res.data.user || res.data;
    },
  });

  // --- LOGIC UPLOAD AVATAR ---
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploadingAvatar(true);

    try {
      // 1. Upload lên Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      // Sử dụng thông tin config từ file PostCreate mẫu của bạn
      formData.append("upload_preset", "3P1N-PMIT");
      formData.append("cloud_name", "dezlofvj8");

      const cloudRes = await fetch(
        import.meta.env.VITE_CLOUDINARY_UPLOAD_URL ||
          "https://api.cloudinary.com/v1_1/dezlofvj8/auto/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!cloudRes.ok) throw new Error("Upload Cloudinary failed");

      const cloudData = await cloudRes.json();
      const newAvatarUrl = cloudData.secure_url;

      // 2. Gọi API Patch update user
      await api.patch(`/userProfile`, {
        avatarUrl: newAvatarUrl,
      });

      // 3. Cập nhật UI
      // Cập nhật AuthContext
      setUserData((prev) => ({ ...prev, avatar: newAvatarUrl }));

      // Invalidate query để load lại dữ liệu profile
      queryClient.invalidateQueries(["profileUser", profileId]);

      alert("Cập nhật ảnh đại diện thành công!");
    } catch (error) {
      console.error("Lỗi khi đổi avatar:", error);
      alert("Đổi ảnh thất bại, vui lòng thử lại.");
    } finally {
      setIsUploadingAvatar(false);
      // Reset input value để user có thể chọn lại cùng 1 file nếu muốn
      event.target.value = null;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-gray-500">Đang tải trang cá nhân...</div>
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
      onAvatarChange={handleAvatarChange}
      isUploadingAvatar={isUploadingAvatar}
    />
  );
}

function ProfileShell({
  profileUser,
  showSuggestTab,
  showAddFriendButton,
  isOwnProfile,
  onAvatarChange,
  isUploadingAvatar,
}) {
  // State để quản lý việc hiển thị ImageViewer
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="profile-layout">
      <div className="profile-card">
        {/* Header profile */}
        <header className="relative">
          {/* Cover */}
          <div className="profile-cover flex justify-center items-end pb-0 relative">
            {/* Wrapper cho Avatar */}
            <div className="relative group">
              
              {/* PHẦN 1: Hiển thị Avatar - Click để xem ảnh (ImageViewer) */}
              <div
                className={`rounded-full border-4 border-white dark:border-gray-800 transition-opacity cursor-pointer ${
                  isUploadingAvatar ? "opacity-50" : ""
                }`}
                onClick={() => {
                   // Nếu đang upload thì không cho xem ảnh
                   if (!isUploadingAvatar && profileUser?.avatarUrl) {
                      setSelectedImage(profileUser.avatarUrl);
                   }
                }}
              >
                <AvatarUser userData={profileUser} size={120} />
              </div>

              {/* Loading Spinner */}
              {isUploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <CircularProgress size={30} />
                </div>
              )}

              {/* PHẦN 2: Nút upload ảnh - Nằm riêng biệt (Separate Button) */}
              {isOwnProfile && !isUploadingAvatar && (
                <>
                  <input
                    accept="image/*"
                    id="icon-button-avatar"
                    type="file"
                    className="hidden"
                    onChange={onAvatarChange}
                  />
                  <label
                    htmlFor="icon-button-avatar"
                    className="absolute bottom-1 right-1 bg-gray-200 dark:bg-gray-700 p-1.5 rounded-full cursor-pointer hover:bg-gray-300 transition shadow-md flex items-center justify-center z-20 border-2 border-white dark:border-gray-800"
                    title="Đổi ảnh đại diện"
                    onClick={(e) => {
                      // Ngăn sự kiện click lan ra ngoài (để không kích hoạt ImageViewer của avatar)
                      e.stopPropagation();
                    }}
                  >
                    <PhotoCamera sx={{ fontSize: 20, color: "#555" }} />
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Info + Nav tab */}
          <div className="px-4 pt-4 pb-4 sm:px-8 flex flex-col items-center gap-3">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {profileUser?.name || "User Name"}
              </h1>
              <p className="text-sm text-gray-500">
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
            <nav className="profile-tabs flex gap-4 border-b border-gray-200 dark:border-gray-700 w-full justify-center mt-4">
              <NavLink
                to=""
                end
                className={({ isActive }) =>
                  isActive
                    ? "profile-tab-link active border-b-2 border-blue-500 text-blue-600 pb-2"
                    : "profile-tab-link pb-2 text-gray-500 hover:text-gray-700"
                }
              >
                Bài viết
              </NavLink>

              <NavLink
                to="ProfileAbout"
                className={({ isActive }) =>
                  isActive
                    ? "profile-tab-link active border-b-2 border-blue-500 text-blue-600 pb-2"
                    : "profile-tab-link pb-2 text-gray-500 hover:text-gray-700"
                }
              >
                Giới thiệu
              </NavLink>

              <NavLink
                to="ProfileFriend"
                className={({ isActive }) =>
                  isActive
                    ? "profile-tab-link active border-b-2 border-blue-500 text-blue-600 pb-2"
                    : "profile-tab-link pb-2 text-gray-500 hover:text-gray-700"
                }
              >
                Bạn bè
              </NavLink>

              {showSuggestTab && (
                <NavLink
                  to="ProfileSuggest"
                  className={({ isActive }) =>
                    isActive
                      ? "profile-tab-link active border-b-2 border-blue-500 text-blue-600 pb-2"
                      : "profile-tab-link pb-2 text-gray-500 hover:text-gray-700"
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
          <Outlet context={{ profileUser, isOwnProfile }} />
        </main>
      </div>

      {/* Hiển thị ImageViewer khi có selectedImage */}
      {selectedImage && (
        <ImageViewer
          src={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}