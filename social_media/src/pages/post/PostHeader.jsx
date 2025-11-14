import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FlagIcon from "@mui/icons-material/Flag";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function PostHeader({
  author,
  timeAgo,
  profileUrl,
  isOwner,
  onEdit,
  onDelete,
  onReport
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // open menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // close menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // handlers
  const handleEdit = () => {
    handleMenuClose();
    onEdit && onEdit();
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete && onDelete();
  };

  const handleReport = () => {
    handleMenuClose();
    onReport && onReport();
  };

  return (
    <div className="flex items-center gap-3 bg-card-light dark:bg-card-dark px-4 pt-4 pb-2 justify-between">
      {/* Left: Avatar + Info */}
      <div className="flex items-center gap-3">
        <div
          className="bg-center bg-no-repeat bg-cover rounded-full h-12 w-12"
          style={{ backgroundImage: `url(${profileUrl})` }}
        />
        <div className="flex flex-col justify-center">
          <p className="text-text-light-primary dark:text-text-dark-primary text-base font-semibold">
            {author}
          </p>
          <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
            {timeAgo}
          </p>
        </div>
      </div>

      {/* Right: Options (menu) */}
      <IconButton onClick={handleMenuOpen} size="small">
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
        {/* Owner menu */}
        {isOwner && (
          <>
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Post</ListItemText>
            </MenuItem>

            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete Post</ListItemText>
            </MenuItem>
          </>
        )}

        {/* Non-owner menu */}
        {!isOwner && (
          <MenuItem onClick={handleReport}>
            <ListItemIcon>
              <FlagIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Report Post</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}
