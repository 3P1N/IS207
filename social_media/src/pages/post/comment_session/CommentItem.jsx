import React, { useState, useContext, useEffect } from "react";
import {
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  InputAdornment,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import SendIcon from "@mui/icons-material/Send";
import CommentReactionsListModal from "../reaction/CommentReactionsListModal";
import { api } from "../../../shared/api";
import { AuthContext } from "../../../router/AuthProvider";
import AvatarUser from "../../../shared/components/AvatarUser";

export default function CommentItem({ comment, setComments, postId, level = 0 }) {
  const { userData } = useContext(AuthContext);
  const theme = useTheme();
  const isOwner = userData?.id === comment.user?.id;
  const [showReactionsModal, setShowReactionsModal] = useState(false);

  // Dữ liệu comment con (đệ quy)
  const [childComments, setChildComments] = useState(comment.children_recursive || []);

  // State hiển thị
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [anchorEl, setAnchorEl] = useState(null);

  // State Like
  const [isLiked, setIsLiked] = useState(comment.is_liked);
  const [likesCount, setLikesCount] = useState(comment.reactions_count);

  // State Reply
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  
  // State chung
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (comment.children_recursive) {
      setChildComments(comment.children_recursive);
    }
  }, [comment.children_recursive]);

  // --- ACTIONS ---
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDelete = async () => {
    handleMenuClose();
    if (!window.confirm("Xóa bình luận này?")) return;
    setLoading(true);
    try {
      await api.delete(`/posts/${postId}/comments/${comment.id}`);
      if (setComments) {
        setComments((prev) => prev.filter((c) => c.id !== comment.id));
      }
      setSnackbar({ open: true, message: "Đã xóa", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Lỗi xóa", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editContent.trim()) return;
    setLoading(true);
    try {
      await api.patch(`/posts/${postId}/comments/${comment.id}`, { content: editContent });
      comment.content = editContent;
      setIsEditing(false);
    } catch (err) {
      setSnackbar({ open: true, message: "Lỗi sửa", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    const prevLiked = isLiked;
    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? likesCount - 1 : likesCount + 1);
    try {
      await api.post(`/posts/${postId}/comments/${comment.id}/reactions`);
    } catch (err) {
      setIsLiked(prevLiked);
      setLikesCount(prevLiked ? likesCount : likesCount);
    }
  };

  // --- LOGIC REPLY ---
  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;

    // 1. UI LẠC QUAN
    const tempId = Date.now(); 
    
    const optimisticComment = {
      id: tempId,
      content: replyContent,
      parent_comment_id: comment.id,
      user: userData,
      created_at: new Date().toISOString(),
      reactions_count: 0,
      is_liked: false,
      children_recursive: [],
      isSending: true,
    };

    setChildComments((prev) => [...prev, optimisticComment]);
    setReplyContent("");
    setIsReplying(false);

    try {
      // 2. API
      const res = await api.post(`/posts/${postId}/comments/${comment.id}/replies`, {
        content: optimisticComment.content,
        parent_comment_id: comment.id,
      });

      // 3. UPDATE REAL DATA
      setChildComments((prev) =>
        prev.map((c) => {
          if (c.id === tempId) {
            return { 
                ...res.data, 
                user: res.data.user || userData, 
                children_recursive: [],
                isSending: false 
            };
          }
          return c;
        })
      );
    } catch (err) {
      console.error("Reply error:", err);
      setChildComments((prev) => prev.filter((c) => c.id !== tempId));
      setSnackbar({ open: true, message: "Gửi phản hồi thất bại", severity: "error" });
    }
  };

  const time = new Date(comment.created_at).toLocaleDateString("vi-VN");

  return (
    <Box sx={{ width: "100%", mb: 1.5 }}>
      
      {/* --- PHẦN COMMENT CHÍNH --- */}
      {/* UPDATE 1: Tăng gap lên 2 (16px) */}
      <Box sx={{ display: "flex", gap: 3 }}> 
        
        {/* Avatar Wrapper */}
        <Box sx={{ width: 32, height: 32, flexShrink: 0 }}>
             <AvatarUser userData={comment.user || {}} />
        </Box>

        <Box sx={{ flex: 1 }}>
          {/* Bong bóng chat */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                borderRadius: 4,
                p: 1.5,
                width: "fit-content",
                minWidth: "150px",
                position: "relative",
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                color: 'text.primary',
                border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'transparent'}`
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                {comment.user?.name}
              </Typography>

              {isEditing ? (
                <Box sx={{ mt: 1, minWidth: "200px" }}>
                  <TextField
                    fullWidth multiline size="small"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    sx={{ bgcolor: "background.paper" }}
                  />
                  <Box sx={{ mt: 1, display: "flex", gap: 1, justifyContent: "flex-end" }}>
                    <Button size="small" onClick={() => setIsEditing(false)} color="inherit">Hủy</Button>
                    <Button size="small" onClick={handleEditSubmit} variant="contained">Lưu</Button>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" sx={{ fontSize: "0.95rem", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {comment.content}
                </Typography>
              )}

              {/* Icon Like Count */}
              {likesCount > 0 && !isEditing && (
                <Box
                  onClick={(e) => { e.stopPropagation(); setShowReactionsModal(true); }}
                  sx={{
                    position: 'absolute', bottom: -12, right: 0,
                    bgcolor: 'background.paper', borderRadius: 10,
                    boxShadow: 2, px: 0.8, py: 0.3, display: 'flex', alignItems: 'center', gap: 0.5,
                    cursor: "pointer", border: '1px solid', borderColor: 'divider', zIndex: 10
                  }}
                >
                  <ThumbUpAltIcon sx={{ width: 14, height: 14, color: '#1976d2' }} />
                  <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{likesCount}</Typography>
                </Box>
              )}
            </Box>

            {/* Menu More */}
            {isOwner && !isEditing && (
              <>
                <IconButton size="small" onClick={handleMenuOpen}><MoreVertIcon fontSize="small" /></IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={() => { handleMenuClose(); setIsEditing(true); }}>Chỉnh sửa</MenuItem>
                  <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>Xóa</MenuItem>
                </Menu>
              </>
            )}
          </Box>

          {/* --- ACTION BAR --- */}
          {!isEditing && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 1.5, mt: 0.5 }}>
              {comment.isSending ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CircularProgress size={10} thickness={5} />
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                        Đang gửi...
                    </Typography>
                </Box>
              ) : (
                <>
                  <Typography variant="caption" color="text.secondary">{time || "Vừa xong"}</Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", cursor: "pointer", color: isLiked ? "primary.main" : "text.secondary" }}
                    onClick={handleLike}
                  >
                    Thích
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", cursor: "pointer", color: "text.secondary" }}
                    onClick={() => setIsReplying(!isReplying)}
                  >
                    Phản hồi
                  </Typography>
                </>
              )}
            </Box>
          )}

          {/* --- FORM REPLY --- */}
          {isReplying && (
            // UPDATE 3: Tăng gap lên 2 cho thoáng
            <Box sx={{ mt: 1.5, display: "flex", gap: 4, alignItems: "flex-start" }}>
               <Box sx={{ width: 24, height: 24, mt: 0.5 }}>
                  <AvatarUser userData={userData} />
               </Box>
              <TextField
                fullWidth size="small"
                placeholder={`Phản hồi ${comment.user?.name}...`}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                autoFocus
                multiline
                maxRows={4}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleReplySubmit();
                    }
                }}
                InputProps={{
                  sx: { borderRadius: 3, fontSize: '0.9rem', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleReplySubmit} disabled={!replyContent.trim()}>
                        <SendIcon fontSize="small" color={replyContent.trim() ? "primary" : "disabled"} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* --- RENDER CON --- */}
      {childComments && childComments.length > 0 && (
        <Box sx={{ 
            mt: 0.5, 
            // UPDATE 2: Tăng padding-left lên 48px (32px Avatar + 16px Gap) để thẳng hàng
            pl: level === 0 ? '48px' : 0 
        }}>
          {childComments.map((child) => (
            <CommentItem
              key={child.id || `temp-${child.created_at}`}
              comment={child}
              postId={postId}
              setComments={setChildComments}
              level={level + 1}
            />
          ))}
        </Box>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>

      {showReactionsModal && (
        <CommentReactionsListModal
          postId={postId}
          commentId={comment.id}
          onClose={() => setShowReactionsModal(false)}
        />
      )}
    </Box>
  );
}