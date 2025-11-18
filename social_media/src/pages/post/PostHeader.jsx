import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import FlagIcon from "@mui/icons-material/Flag";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AvatarUser from "../../shared/components/AvatarUser";
import EditPostModal from "./EditPostModal";

// author,
//   timeAgo,
//   profileUrl,
//   isOwner,
//   onEdit,
//   onDelete,
//   onReport

export default function PostHeader({ headerData, postData }) {
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
        <>
          <AvatarUser userData={{ name: headerData?.author, avatarUrl: headerData?.avatarUrl, id: headerData?.id }} />
        </>
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
