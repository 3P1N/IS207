import React, { useState, useContext, useEffect, useRef } from "react";
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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import SendIcon from "@mui/icons-material/Send";
import CommentReactionsListModal from "../reaction/CommentReactionsListModal";
import { api } from "../../../shared/api";
import { AuthContext } from "../../../router/AuthProvider";
// Import component hiển thị danh sách like nếu cần (giữ placeholder nếu chưa có)
// import CommentReactionsListModal from '../reaction/CommentReactionsListModal';

export default function CommentItem({ comment, setComments, postId }) {
    const { userData } = useContext(AuthContext);
    const isOwner = userData?.id === comment.user?.id;
    const [showReactionsModal, setShowReactionsModal] = useState(false);
    // --- STATE DỮ LIỆU ---
    // Quản lý danh sách comment con của comment này
    const [childComments, setChildComments] = useState(comment.children_recursive || []);

    // --- STATE HIỂN THỊ & EDIT ---
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [anchorEl, setAnchorEl] = useState(null); // Menu 3 chấm

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

    // Đồng bộ lại childComments nếu props thay đổi
    useEffect(() => {
        if (comment.children_recursive) {
            setChildComments(comment.children_recursive);
        }
    }, [comment.children_recursive]);

    // --- HANDLERS: MENU ---
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    // --- HANDLERS: DELETE ---
    const handleDelete = async () => {
        handleMenuClose();
        if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;

        setLoading(true);
        try {
            await api.delete(`/posts/${postId}/comments/${comment.id}`);

            // Xóa comment này khỏi danh sách của cha (thông qua prop setComments)
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

    // --- HANDLERS: EDIT ---
    const handleEditSubmit = async () => {
        if (!editContent.trim()) return;
        setLoading(true);
        try {
            // Giả sử API patch comment
            await api.patch(`/posts/${postId}/comments/${comment.id}`, { content: editContent });

            // Update UI cục bộ (Vì ta đang hiển thị editContent trong ô input, 
            // nhưng cần update lại content gốc để hiển thị khi thoát chế độ edit)
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

    // --- HANDLERS: LIKE ---
    const handleLike = async () => {
        const prevLiked = isLiked;
        setIsLiked(!prevLiked);
        setLikesCount(prevLiked ? likesCount - 1 : likesCount + 1);

        try {
            await api.post(`/posts/${postId}/comments/${comment.id}/reactions`);
        } catch (err) {
            console.error("Like error:", err);
            // Rollback
            setIsLiked(prevLiked);
            setLikesCount(prevLiked ? likesCount : likesCount);
        }
    };

    // --- HANDLERS: REPLY ---
    const handleReplySubmit = async () => {
        if (!replyContent.trim()) return;
        setReplyLoading(true);

        try {
            const res = await api.post(`/posts/${postId}/comments/${comment.id}/replies`, {
                content: replyContent,
                parent_comment_id: comment.id, // ID của comment hiện tại làm cha
            });

            // Tạo object comment mới từ response (hoặc mock nếu API không trả về full user)
            const newComment = {
                ...res.data,
                // Nếu API trả về thiếu thông tin user, ta có thể fill tạm từ userData hiện tại
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
            {/* Avatar */}
            <Avatar
                src={comment.user?.avatarUrl || "/default-avatar.png"}
                alt={comment.user?.name}
                sx={{ width: 32, height: 32 }}
            />

            <Box sx={{ flex: 1 }}>
                {/* --- KHỐI BONG BÓNG CHAT --- */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                        className="bg-gray-100 dark:bg-gray-700"
                        sx={{
                            borderRadius: 4,
                            p: 1.5,
                            width: "fit-content",
                            minWidth: "150px",
                            position: "relative",
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                            {comment.user?.name}
                        </Typography>

                        {/* Nội dung Comment hoặc Ô Edit */}
                        {isEditing ? (
                            <Box sx={{ mt: 1, minWidth: "200px" }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    size="small"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    sx={{ bgcolor: "background.paper" }}
                                />
                                <Box sx={{ mt: 1, display: "flex", gap: 1, justifyContent: "flex-end" }}>
                                    <Button size="small" onClick={() => setIsEditing(false)} color="inherit">Hủy</Button>
                                    <Button size="small" variant="contained" onClick={handleEditSubmit} disabled={loading}>Lưu</Button>
                                </Box>
                            </Box>
                        ) : (
                            <Typography variant="body2" sx={{ fontSize: "0.95rem", whiteSpace: "pre-wrap" }}>
                                {comment.content}
                            </Typography>
                        )}

                        {/* Hiển thị icon Like nhỏ ở góc bong bóng nếu có like */}
                        {likesCount > 0 && !isEditing && (
                            <Box
                                onClick={(e) => {
                                    e.stopPropagation(); // Tránh bubbling sự kiện không mong muốn
                                    setShowReactionsModal(true);
                                }}
                                sx={{
                                    position: 'absolute', bottom: -10, right: 0,
                                    bgcolor: 'background.paper', borderRadius: 10,
                                    boxShadow: 1, px: 0.5, py: 0.2, display: 'flex', alignItems: 'center', gap: 0.5,
                                    cursor: "pointer",
                                    transition: "all 0.15s ease-in-out",   // 👈 Mượt
                                    "&:hover": {
                                        transform: "scale(1.05)",         // 👈 Phóng nhẹ 5%
                                        bgcolor: "action.hover",          // 👈 Nền xám trong theme
                                        boxShadow: 2                      // 👈 Shadow mạnh hơn chút
                                    }
                                }}
                            >
                                <ThumbUpAltIcon sx={{ width: 12, height: 12, color: '#1976d2' }} />
                                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{likesCount}</Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Menu 3 chấm (Chỉ hiện nếu là owner) */}
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

                {/* --- THANH ACTION (Like, Reply, Time) --- */}
                {!isEditing && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 1, mt: 0.5 }}>
                        {comment.isSending ? (
                            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                Đang gửi...
                            </Typography>
                        ) : (
                            <Typography variant="caption" color="text.secondary">
                                {/* Hàm format time của bạn, ví dụ: moment(comment.created_at).fromNow() */}
                                {time || "Vừa xong"}
                            </Typography>
                        )}

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
                    </Box>
                )}

                {/* --- FORM NHẬP REPLY --- */}
                {isReplying && (
                    <Box sx={{ mt: 1.5, display: "flex", gap: 1, alignItems: "flex-start" }}>
                        <Avatar src={userData?.avatarUrl} sx={{ width: 24, height: 24 }} />
                        <TextField
                            fullWidth
                            size="small"
                            placeholder={`Phản hồi ${comment.user?.name}...`}
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            autoFocus
                            InputProps={{
                                sx: { borderRadius: 3, fontSize: '0.9rem' },
                                endAdornment: (
                                    <IconButton size="small" onClick={handleReplySubmit} disabled={!replyContent.trim() || replyLoading}>
                                        {replyLoading ? <CircularProgress size={16} /> : <SendIcon fontSize="small" color={replyContent.trim() ? "primary" : "disabled"} />}
                                    </IconButton>
                                )
                            }}
                        />
                    </Box>
                )}

                {/* --- ĐỆ QUY: RENDER DANH SÁCH COMMENT CON --- */}
                {childComments && childComments.length > 0 && (
                    <Box sx={{ mt: 1.5 }}>
                        {childComments.map((child) => (
                            <CommentItem
                                key={child.id}
                                comment={child}
                                postId={postId}
                                // Quan trọng: Truyền setChildComments của cha xuống làm setComments cho con
                                // Để con có thể gọi setComments để tự xóa mình khỏi danh sách cha
                                setComments={setChildComments}
                            />
                        ))}
                    </Box>
                )}
            </Box>

            {/* Snackbar thông báo */}
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