import { Outlet, NavLink, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import {
  useQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Snackbar, Alert } from "@mui/material";

import AvatarUser from "../../shared/components/AvatarUser";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";
import ImageViewer from "../../shared/components/ImageViewer";

export default function ProfileLayout() {
  const { userData, setUserData } = useContext(AuthContext);
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error" | "info" | "warning"
  });

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Nếu không có id (vd: /profile) thì dùng id của chính mình
  const profileId = id ?? userData?.id;

  // Xác định có phải đang xem profile của chính mình không (FE)
  const isOwnProfile =
    String(userData?.id) === String(profileId);

  // --- LOAD PROFILE USER ---
  const {
    data: profileUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profileUser", profileId],
    enabled: !!profileId,
    queryFn: async () => {
      const res = await api.get(`/users/${profileId}`);
      return res.data.user; // backend trả { user: { ... } }
    },
  });

  // --- LOGIC UPLOAD AVATAR ---
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
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

      await api.patch(`/userProfile`, {
        avatarUrl: newAvatarUrl,
      });

      setUserData((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));

      queryClient.invalidateQueries(["profileUser", profileId]);

      setSnackbar({
        open: true,
        message: "Cập nhật ảnh đại diện thành công!",
        severity: "success",
      });
    } catch (error) {
      console.error("Lỗi khi đổi avatar:", error);
      setSnackbar({
        open: true,
        message: "Đổi ảnh thất bại, vui lòng thử lại.",
        severity: "error",
      });
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = null;
    }
  };

  // ====== MUTATION: GỬI LỜI MỜI KẾT BẠN ======
  const addFriendMutation = useMutation({
    mutationFn: async () => {
      if (!profileUser?.id) throw new Error("No profile user id");
      const res = await api.post("/friendships", {
        addressee_id: profileUser.id,
      });
      return res.data;
    },
    onSuccess: () => {
      // refetch lại profile để cập nhật friend_status & friendship_id
      queryClient.invalidateQueries(["profileUser", profileId]);
      setSnackbar({
        open: true,
        message: "Đã gửi lời mời kết bạn.",
        severity: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Gửi lời mời kết bạn thất bại.",
        severity: "error",
      });
    },
  });

  // ====== MUTATION: XÁC NHẬN LỜI MỜI ======
  const acceptFriendMutation = useMutation({
    mutationFn: async (friendshipId) => {
      if (!friendshipId) throw new Error("No friendship id");
      await api.patch(`/friendships/${friendshipId}`, {
        status: "accepted",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profileUser", profileId]);
      setSnackbar({
        open: true,
        message: "Đã chấp nhận lời mời kết bạn.",
        severity: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Không thể chấp nhận lời mời.",
        severity: "error",
      });
    },
  });
  const unfriendMutation = useMutation({
    mutationFn: async (friendshipId) => {
      if (!friendshipId) throw new Error("No friendship id");
      await api.delete(`/friendship/${friendshipId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profileUser", profileId]);
      setSnackbar({
        open: true,
        message: "Đã hủy kết bạn.",
        severity: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Hủy kết bạn thất bại.",
        severity: "error",
      });
    },
  });
  // Loading chung cho các hành động friend
  const isFriendActionLoading =
    addFriendMutation.isLoading || acceptFriendMutation.isLoading||
  unfriendMutation.isLoading;

  // --- HANDLERS ĐỂ TRUYỀN XUỐNG BUTTON ---
  const handleAddFriend = () => {
    if (!profileUser) return;
    addFriendMutation.mutate();
  };

  const handleAcceptFriend = () => {
    if (!profileUser?.friendship_id) return;
    acceptFriendMutation.mutate(profileUser.friendship_id);
  };

  const handleUnfriend = () => {
    if (!profileUser?.friendship_id) return;
    unfriendMutation.mutate(profileUser.friendship_id);
  };
  // --- RENDER ---
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
    <>
      <ProfileShell
        key={profileUser?.id}
        profileUser={profileUser}
        showSuggestTab={showSuggestTab}
        showAddFriendButton={showAddFriendButton}
        isOwnProfile={isOwnProfile}
        onAvatarChange={handleAvatarChange}
        isUploadingAvatar={isUploadingAvatar}
        onAddFriend={handleAddFriend}
        onAcceptFriend={handleAcceptFriend}
        onUnfriend={handleUnfriend}  
        isFriendActionLoading={isFriendActionLoading}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((prev) => ({ ...prev, open: false }))
        }
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() =>
            setSnackbar((prev) => ({ ...prev, open: false }))
          }
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

function ProfileShell({
  profileUser,
  showSuggestTab,
  showAddFriendButton,
  isOwnProfile,
  onAvatarChange,
  isUploadingAvatar,
  onAddFriend,
  onAcceptFriend,
  onUnfriend, 
  isFriendActionLoading,
  
}) {
  const [selectedImage, setSelectedImage] = useState(null);

  const friendStatus = profileUser?.friend_status; // none/self/friends/...
  const friendshipId = profileUser?.friendship_id;
  const [showFriendMenu, setShowFriendMenu] = useState(false);
  return (
    <div className="profile-layout scrollbar-thin">
      <div className="profile-card">
        {/* Header profile */}
        <header className="relative">
          {/* Cover */}
          <div className="profile-cover flex justify-center items-end pb-0 relative">
            <div className="relative group">
              {/* AVATAR */}
              <div
                className={`
                  relative flex items-center justify-center overflow-hidden
                  rounded-full border-4 border-white dark:border-gray-800 transition-opacity cursor-pointer
                  w-32 h-32 md:w-40 md:h-40
                  ${isUploadingAvatar ? "opacity-50" : ""}
                `}
                onClick={() => {
                  if (!isUploadingAvatar && profileUser?.avatarUrl) {
                    setSelectedImage(profileUser.avatarUrl);
                  }
                }}
              >
                {profileUser?.avatarUrl ? (
                  <img
                    src={profileUser.avatarUrl}
                    alt={profileUser?.name || "Avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <AvatarUser userData={profileUser} size={150} />
                )}
              </div>

              {isUploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <CircularProgress size={30} />
                </div>
              )}

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
                      e.stopPropagation();
                    }}
                  >
                    <PhotoCamera
                      sx={{ fontSize: 20, color: "#555" }}
                    />
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
                <>
                  {friendStatus === "friends" ? (
                    <div className="relative inline-block mt-3">
                      {/* Nút chính: Bạn bè */}
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 shadow disabled:opacity-70"
                        onClick={() => setShowFriendMenu((prev) => !prev)}
                        disabled={isFriendActionLoading}
                      >
                        Bạn bè
                        <span className="text-xs">▼</span>
                      </button>

                      {/* Menu popup: Hủy kết bạn */}
                      {showFriendMenu && (
                        <div
                          className="absolute left-1/2 -translate-x-1/2 mt-2 w-40 rounded-xl bg-white shadow-lg ring-1 ring-black/5 z-20 text-sm text-gray-700"
                        >
                          <button
                            type="button"
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-xl disabled:opacity-70"
                            onClick={() => {
                              onUnfriend?.();
                              setShowFriendMenu(false);
                            }}
                            disabled={isFriendActionLoading}
                          >
                            {isFriendActionLoading ? "Đang hủy..." : "Hủy kết bạn"}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : friendStatus === "outgoing_request" ? (
                    <button
                      type="button"
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 shadow"
                      disabled
                    >
                      Đã gửi lời mời
                    </button>
                  ) : friendStatus === "incoming_request" ? (
                    <button
                      type="button"
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-500 disabled:opacity-70"
                      onClick={onAcceptFriend}
                      disabled={isFriendActionLoading}
                    >
                      {isFriendActionLoading
                        ? "Đang xử lý..."
                        : "Xác nhận lời mời"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-gray-800 active:scale-[0.98] transition disabled:opacity-70"
                      onClick={onAddFriend}
                      disabled={isFriendActionLoading}
                    >
                      {isFriendActionLoading
                        ? "Đang gửi..."
                        : "Thêm bạn bè"}
                    </button>
                  )}
                </>
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

      {selectedImage && (
        <ImageViewer
          src={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
