import { Outlet, NavLink, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import {
  useQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { 
    CircularProgress, 
    Snackbar, 
    Alert, 
    Chip,
    Stack, 
    Tooltip,
    Typography, // Import thêm
    Box,        // Import thêm
    Button,     // Import thêm Button của MUI để thay thế button thường
    Menu,       // Import Menu cho dropdown
    MenuItem    // Import MenuItem
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Icon mũi tên

import AvatarUser from "../../shared/components/AvatarUser";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";
import ImageViewer from "../../shared/components/ImageViewer";
import NotFoundPage from "../not-found/NotFoundPage";

export default function ProfileLayout() {
  const { userData, setUserData } = useContext(AuthContext);
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const profileId = id ?? userData?.id;
  const isOwnProfile = String(userData?.id) === String(profileId);

  // --- LOGIC FETCH PROFILE ---
  const {
    data: profileUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profileUser", profileId],
    enabled: !!profileId,
    staleTime: 5 * 60 * 1000, 
    queryFn: async () => {
      try {
        const res = await api.get(`/users/${profileId}`);
        return res.data.user; 
      } catch (error) {
        if (error.response && error.response.status === 404) {
          return { isNotFound: true };
        }
        throw error;
      }
    },
    retry: (failureCount, error) => {
        if (error.response?.status === 404) return false;
        return failureCount < 3;
    }
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

  // ====== MUTATION: FRIEND LOGIC ======
  const addFriendMutation = useMutation({
    mutationFn: async () => {
      if (!profileUser?.id) throw new Error("No profile user id");
      const res = await api.post("/friendships", {
        addressee_id: profileUser.id,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profileUser", profileId]);
      setSnackbar({ open: true, message: "Đã gửi lời mời kết bạn.", severity: "success" });
    },
    onError: () => {
      setSnackbar({ open: true, message: "Gửi lời mời kết bạn thất bại.", severity: "error" });
    },
  });

  const acceptFriendMutation = useMutation({
    mutationFn: async (friendshipId) => {
      if (!friendshipId) throw new Error("No friendship id");
      await api.patch(`/friendships/${friendshipId}`, { status: "accepted" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profileUser", profileId]);
      setSnackbar({ open: true, message: "Đã chấp nhận lời mời kết bạn.", severity: "success" });
    },
    onError: () => {
      setSnackbar({ open: true, message: "Không thể chấp nhận lời mời.", severity: "error" });
    },
  });

  const unfriendMutation = useMutation({
    mutationFn: async (friendshipId) => {
      if (!friendshipId) throw new Error("No friendship id");
      await api.delete(`/friendship/${friendshipId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profileUser", profileId]);
      setSnackbar({ open: true, message: "Đã hủy kết bạn.", severity: "success" });
    },
    onError: () => {
      setSnackbar({ open: true, message: "Hủy kết bạn thất bại.", severity: "error" });
    },
  });

  const isFriendActionLoading =
    addFriendMutation.isLoading || acceptFriendMutation.isLoading || unfriendMutation.isLoading;

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

  if (profileUser?.isNotFound) return <NotFoundPage />;

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-gray-500 flex justify-center pt-10">
         <CircularProgress size={30} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-sm text-red-500 text-center pt-10">
        Đã có lỗi xảy ra khi tải trang cá nhân.
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
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
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
  const friendStatus = profileUser?.friend_status; 
  // State cho Menu Dropdown MUI
  const [anchorEl, setAnchorEl] = useState(null);
  const showFriendMenu = Boolean(anchorEl);

  const handleFriendMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleFriendMenuClose = () => {
    setAnchorEl(null);
  };
  const isAdmin = profileUser?.role === 'admin';

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

          {/* Info + Nav tab - ĐÃ FIX HIỂN THỊ TÊN */}
          <div className="px-4 pt-4 pb-4 sm:px-8 flex flex-col items-center gap-2">
            <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Stack direction="row" alignItems="center" gap={1} justifyContent="center">
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                  {profileUser?.name || "User Name"}
                </Typography>
                
                {/* Hiển thị Icon Admin nếu là admin */}
                {isAdmin && (
                  <Tooltip title="Quản trị viên hệ thống" arrow>
                    <SecurityIcon 
                      color="primary" 
                      sx={{ fontSize: 24 }} 
                    />
                  </Tooltip>
                )}
              </Stack>
            </Box>

            {showAddFriendButton && (
              <Box sx={{ mt: 1 }}>
                {friendStatus === "friends" ? (
                  <>
                    {/* Button Bạn bè dùng MUI */}
                    <Button 
                        variant="contained" 
                        color="inherit" 
                        onClick={handleFriendMenuClick}
                        disabled={isFriendActionLoading}
                        endIcon={<ExpandMoreIcon />}
                        sx={{ textTransform: 'none', borderRadius: 20, bgcolor: 'action.selected' }}
                    >
                      Bạn bè
                    </Button>

                    {/* Menu Popup MUI (Thay thế div menu cũ) */}
                    <Menu
                        anchorEl={anchorEl}
                        open={showFriendMenu}
                        onClose={handleFriendMenuClose}
                    >
                        <MenuItem onClick={() => {
                            onUnfriend?.();
                            handleFriendMenuClose();
                        }} sx={{ color: 'error.main' }}>
                            {isFriendActionLoading ? "Đang xử lý..." : "Hủy kết bạn"}
                        </MenuItem>
                    </Menu>
                  </>
                ) : friendStatus === "outgoing_request" ? (
                  <Button 
                    variant="contained" 
                    disabled 
                    sx={{ textTransform: 'none', borderRadius: 20 }}
                  >
                    Đã gửi lời mời
                  </Button>
                ) : friendStatus === "incoming_request" ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onAcceptFriend}
                    disabled={isFriendActionLoading}
                    sx={{ textTransform: 'none', borderRadius: 20 }}
                  >
                    {isFriendActionLoading ? "Đang xử lý..." : "Xác nhận lời mời"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    sx={{ 
                        textTransform: 'none', 
                        borderRadius: 20, 
                        bgcolor: 'text.primary', 
                        color: 'background.paper',
                        '&:hover': { bgcolor: 'text.secondary' }
                    }}
                    onClick={onAddFriend}
                    disabled={isFriendActionLoading}
                  >
                    {isFriendActionLoading ? "Đang gửi..." : "Thêm bạn bè"}
                  </Button>
                )}
              </Box>
            )}

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