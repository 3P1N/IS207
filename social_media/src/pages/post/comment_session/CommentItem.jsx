import React, { useState, useContext, useEffect } from "react";
import {
    Avatar,
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
    useTheme, // Import thêm useTheme
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined"; // Giữ lại nếu cần
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import SendIcon from "@mui/icons-material/Send";
import CommentReactionsListModal from "../reaction/CommentReactionsListModal";
import { api } from "../../../shared/api";
import { AuthContext } from "../../../router/AuthProvider";
import AvatarUser from "../../../shared/components/AvatarUser";

export default function CommentItem({ comment, setComments, postId }) {
    const { userData } = useContext(AuthContext);
    const theme = useTheme(); // Hook để lấy giá trị theme hiện tại
    const isOwner = userData?.id === comment.user?.id;
    const [showReactionsModal, setShowReactionsModal] = useState(false);

    // --- STATE DỮ LIỆU ---
    const [childComments, setChildComments] = useState(comment.children_recursive || []);

    // --- STATE HIỂN THỊ & EDIT ---
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [anchorEl, setAnchorEl] = useState(null);

    // --- STATE LIKE ---
    const [isLiked, setIsLiked] = useState(comment.is_liked);
    const [likesCount, setLikesCount] = useState(comment.reactions_count);

    // --- STATE REPLY ---
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [replyLoading, setReplyLoading] = useState(false);

    // --- STATE CHUNG ---
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        if (comment.children_recursive) {
            setChildComments(comment.children_recursive);
        }
    }, [comment.children_recursive]);

    // --- HANDLERS ---
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleDelete = async () => {
        handleMenuClose();
        if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;
        setLoading(true);
        try {
            await api.delete(`/posts/${postId}/comments/${comment.id}`);
            if (setComments) {
                setComments((prev) => prev.filter((c) => c.id !== comment.id));
            }
            setSnackbar({ open: true, message: "Đã xóa bình luận", severity: "success" });
        } catch (err) {
            console.error("Delete error:", err);
            setSnackbar({ open: true, message: "Lỗi khi xóa bình luận", severity: "error" });
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
            setSnackbar({ open: true, message: "Đã chỉnh sửa bình luận", severity: "success" });
        } catch (err) {
            console.error("Edit error:", err);
            setSnackbar({ open: true, message: "Lỗi khi sửa bình luận", severity: "error" });
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
            console.error("Like error:", err);
            setIsLiked(prevLiked);
            setLikesCount(prevLiked ? likesCount : likesCount);
        }
    };

    const handleReplySubmit = async () => {
        if (!replyContent.trim()) return;
        setReplyLoading(true);
        try {
            const res = await api.post(`/posts/${postId}/comments/${comment.id}/replies`, {
                content: replyContent,
                parent_comment_id: comment.id,
            });
            const newComment = {
                ...res.data,
                user: res.data.user || userData,
                children_recursive: []
            };
            setChildComments((prev) => [...prev, newComment]);
            setReplyContent("");
            setIsReplying(false);
            setSnackbar({ open: true, message: "Đã trả lời bình luận", severity: "success" });
        } catch (err) {
            console.error("Reply error:", err);
            setSnackbar({ open: true, message: "Lỗi gửi phản hồi", severity: "error" });
        } finally {
            setReplyLoading(false);
        }
    };

    const time = new Date(comment.created_at).toLocaleDateString("vi-VN");

    return (
        <Box sx={{ display: "flex", gap: 1.5, mb: 2, width: "100%" }}>
            <Box
                sx={{
                    // 1. Định vị kích thước container ngoài cùng
                    width: 32,
                    height: 32,

                    // 2. Can thiệp sâu (deep selector) vào IconButton của AvatarUser
                    // Vì AvatarUser trả về IconButton, ta cần loại bỏ padding để nó không bị to ra
                    "& .MuiIconButton-root": {
                        p: 0,           // Xóa padding mặc định của IconButton
                        width: 32,      // Ép kích thước nút bấm
                        height: 32,
                    },

                    // 3. Can thiệp vào Avatar bên trong IconButton
                    "& .MuiAvatar-root": {
                        width: 32,      // Ép kích thước ảnh
                        height: 32,
                        fontSize: "0.8rem" // Chỉnh font chữ nếu avatar hiển thị ký tự thay vì ảnh
                    }
                }}
            >
                {/* Truyền prop đúng theo yêu cầu của AvatarUser */}
                <AvatarUser userData={comment.user || {}} />
            </Box>

            <Box sx={{ flex: 1 }}>
                {/* --- KHỐI BONG BÓNG CHAT ĐÃ FIX --- */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                        sx={{
                            borderRadius: 4,
                            p: 1.5,
                            width: "fit-content",
                            minWidth: "150px",
                            position: "relative",
                            // --- FIX MÀU SẮC TẠI ĐÂY ---
                            // 1. Dùng màu của Theme MUI để đảm bảo tương phản với màu chữ
                            // 2. Nếu là Dark Mode -> dùng grey.800, Light Mode -> dùng grey.100
                            // 3. Ép màu chữ (color) luôn là text.primary để tránh bị trình duyệt override
                            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                            color: 'text.primary',
                            border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'transparent'}` // Thêm border nhẹ ở dark mode cho rõ
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                            {comment.user?.name}
                        </Typography>

                        {isEditing ? (
                            <Box sx={{ mt: 1, minWidth: "200px" }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    size="small"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    sx={{
                                        bgcolor: "background.paper",
                                        "& .MuiInputBase-root": { fontSize: "0.95rem" }
                                    }}
                                />
                                <Box sx={{ mt: 1, display: "flex", gap: 1, justifyContent: "flex-end" }}>
                                    <Button size="small" onClick={() => setIsEditing(false)} color="inherit">Hủy</Button>
                                    <Button size="small" variant="contained" onClick={handleEditSubmit} disabled={loading}>Lưu</Button>
                                </Box>
                            </Box>
                        ) : (
                            <Typography variant="body2" sx={{ fontSize: "0.95rem", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                {comment.content}
                            </Typography>
                        )}

                        {/* Icon Like nhỏ */}
                        {likesCount > 0 && !isEditing && (
                            <Box
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowReactionsModal(true);
                                }}
                                sx={{
                                    position: 'absolute', bottom: -12, right: 0,
                                    bgcolor: 'background.paper', borderRadius: 10,
                                    boxShadow: 2, px: 0.8, py: 0.3, display: 'flex', alignItems: 'center', gap: 0.5,
                                    cursor: "pointer",
                                    border: '1px solid',
                                    borderColor: 'divider', // Thêm viền nhẹ để tách biệt
                                    transition: "all 0.2s",
                                    "&:hover": { transform: "scale(1.1)" }
                                }}
                            >
                                <ThumbUpAltIcon sx={{ width: 14, height: 14, color: '#1976d2' }} />
                                <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{likesCount}</Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Menu 3 chấm */}
                    {isOwner && !isEditing && (
                        <IconButton size="small" onClick={handleMenuOpen}>
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                    )}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={() => { handleMenuClose(); setIsEditing(true); }}>Chỉnh sửa</MenuItem>
                        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>Xóa</MenuItem>
                    </Menu>
                </Box>

                {/* --- THANH ACTION --- */}
                {!isEditing && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 1.5, mt: 0.5 }}>
                        {comment.isSending ? (
                            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold' }}>Đang gửi...</Typography>
                        ) : (
                            <Typography variant="caption" color="text.secondary">
                                {time || "Vừa xong"}
                            </Typography>
                        )}

                        <Typography
                            variant="caption"
                            sx={{ fontWeight: "bold", cursor: "pointer", color: isLiked ? "primary.main" : "text.secondary", "&:hover": { textDecoration: 'underline' } }}
                            onClick={handleLike}
                        >
                            Thích
                        </Typography>

                        <Typography
                            variant="caption"
                            sx={{ fontWeight: "bold", cursor: "pointer", color: "text.secondary", "&:hover": { textDecoration: 'underline' } }}
                            onClick={() => setIsReplying(!isReplying)}
                        >
                            Phản hồi
                        </Typography>
                    </Box>
                )}

                {/* --- FORM REPLY --- */}
                {isReplying && (
                    <Box sx={{ mt: 1.5, display: "flex", gap: 1, alignItems: "flex-start" }}>
                        {/* <Avatar src={userData?.avatarUrl} sx={{ width: 24, height: 24 }} /> */}
                        <AvatarUser userData={userData} />
                        <TextField
                            fullWidth
                            size="small"
                            placeholder={`Phản hồi ${comment.user?.name}...`}
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            autoFocus
                            InputProps={{
                                sx: { borderRadius: 3, fontSize: '0.9rem', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50' },
                                endAdornment: (
                                    <IconButton size="small" onClick={handleReplySubmit} disabled={!replyContent.trim() || replyLoading}>
                                        {replyLoading ? <CircularProgress size={16} /> : <SendIcon fontSize="small" color={replyContent.trim() ? "primary" : "disabled"} />}
                                    </IconButton>
                                )
                            }}
                        />
                    </Box>
                )}

                {/* --- ĐỆ QUY --- */}
                {childComments && childComments.length > 0 && (
                    <Box sx={{ mt: 1.5 }}>
                        {childComments.map((child) => (
                            <CommentItem
                                key={child.id}
                                comment={child}
                                postId={postId}
                                setComments={setChildComments}
                            />
                        ))}
                    </Box>
                )}
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
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