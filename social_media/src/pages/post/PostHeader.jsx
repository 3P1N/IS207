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

import DeleteIcon from "@mui/icons-material/Delete";
import FlagIcon from "@mui/icons-material/Flag";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AvatarUser from "../../shared/components/AvatarUser";
import EditPostModal from "./EditPostModal";
import { api } from "../../shared/api";
import { AuthContext } from "../../router/AuthProvider";

export default function PostHeader({ headerData, postData }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // success | error

  // open menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // close menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // handlers
  const handleDelete = () => {
    handleMenuClose();
    onDelete && onDelete();
  };

  const report = async (postId) => {
    const response = await api.post(
      `/posts/${postId}/report`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  };

  const handleReport = async () => {
    setLoading(true);
    try {
      const message = await report(postData.id);
      setSnackbarMessage(message?.message || "Report successfully submitted");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
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
            {headerData?.timeAgo}
          </p>
        </div>
      </div>

      {/* Right: Options (menu) */}
      <IconButton onClick={handleMenuOpen} size="small" disabled={loading}>
        {loading ? <CircularProgress size={20} /> : <MoreVertIcon />}
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
            <MenuItem key="edit">
              <ListItemIcon>
                <EditPostModal postData={postData} />
              </ListItemIcon>
            </MenuItem>,
            <MenuItem key="delete" onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
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
