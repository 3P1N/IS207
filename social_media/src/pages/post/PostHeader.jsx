import { useContext, useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FlagIcon from "@mui/icons-material/Flag";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AvatarUser from "../../shared/components/AvatarUser";
import EditPostModal from "./EditPostModal";
import { api } from "../../shared/api";
import { AuthContext } from "../../router/AuthProvider";

const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  // 'vi-VN' sẽ định dạng theo kiểu Việt Nam
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function PostHeader({ headerData, postData, index }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { postsData, setPostsData } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // success | error
  const timeString = headerData?.created_at || postData?.created_at;

  // open menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // close menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    handleMenuClose(); // Đóng menu dropdown
  };

  const deletePost = async (postId) => {
    const response = await api.delete(
      `/posts/${postId}`
    );
    return response.data;
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const message = await deletePost(postData.id);
      setSnackbarMessage(message?.message || "Delete successfully submitted");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setPostsData(prev => prev.filter((_, i) => i !== index));

    } catch (err) {
      console.log("Lỗi khi delete", err);
      setSnackbarMessage("Failed to delete post");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  const report = async (postId) => {
    const response = await api.post(`/posts/${postId}/report`);
    return response.data;
  };

  const handleReport = async () => {
    setLoading(true);
    try {
      const message = await report(postData.id);
      setSnackbarMessage(message?.message || "Report successfully submitted");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setPostsData(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.log("Lỗi khi report", err);
      setSnackbarMessage("Failed to report post");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  return (
    <div className="flex items-center gap-3 bg-card-light dark:bg-card-dark px-4 pt-4 pb-2 justify-between">
      {/* Left: Avatar + Info */}
      <div className="flex items-center gap-3">
        <AvatarUser userData={{ name: headerData?.author, avatarUrl: headerData?.avatarUrl, id: headerData?.id }} />
        <div className="flex flex-col justify-center">
          <p className="text-text-light-primary dark:text-text-dark-primary text-base font-semibold">
            {headerData?.author}
          </p>
          <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
            {formatDate(timeString)}
          </p>
        </div>
      </div>

      {/* Right: Options (menu) */}
      <IconButton onClick={handleMenuOpen} size="small" disabled={loading}>
        <MoreVertIcon />
      </IconButton>

      {/* Dropdown menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {headerData?.isOwner
          ? [
            <MenuItem key="edit" onClick={handleEditClick}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Post</ListItemText>
            </MenuItem>,
            <MenuItem key="delete" onClick={handleDelete}>
              <ListItemIcon>
                {loading ? <CircularProgress size={18} /> : <DeleteIcon fontSize="small" />}
              </ListItemIcon>
              <ListItemText>Delete Post</ListItemText>
            </MenuItem>
          ]
          : (
            <MenuItem onClick={handleReport} disabled={loading}>
              <ListItemIcon>
                {loading ? <CircularProgress size={18} /> : <FlagIcon fontSize="small" />}
              </ListItemIcon>
              <ListItemText>Report Post</ListItemText>
            </MenuItem>
          )}
      </Menu>

      {isEditing && (
        <EditPostModal
          postData={postData}
          postIndex={index}
          onClose={() => setIsEditing(false)}
        />
      )}

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
