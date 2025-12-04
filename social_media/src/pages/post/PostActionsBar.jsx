// src/components/Post/PostActionsBar.jsx
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../shared/api";
import ReactionsListModal from "./reaction/ReactionsListModal";
import SharesListModal from "./share/SharesListModal";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ShareIcon from "@mui/icons-material/Share";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";
import React from "react";
import PostCommentsModal from "./comment_session/PostCommentsModal";

export default function PostActionsBar({ likes, comments, shares, isShared, isLiked,
    postId, postData, onLikeUpdate, onShareUpdate, onCommentUpdate }) {
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    const [loadingShare, setLoadingShared] = useState(false);
    const [showReactionsModal, setShowReactionsModal] = useState(false);
    const [showSharesModal, setShowSharesModal] = useState(false);

    const sendReaction = async () => {
        const response = await api.post(`/posts/${postId}/reaction`);
        return response;
    }

    const sharePost = async () => {
        const response = await api.post(`/posts/${postId}/share`);
        return response.data;
    }

    const handleShare = async () => {
        if (loadingShare) return;
        const newStatus = !isShared;
        setLoadingShared(true);
        try {
            await sharePost();
            setSnackbarMessage(!isShared ? "Post shared successfully!" : "Share cancelled!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            onShareUpdate(newStatus);
        } catch (err) {
            console.error("Error sharing post: ", err);
            setSnackbarMessage(!isShared ? "Failed to share the post!" : "Failed to cancel share!");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoadingShared(false);
        }
    };

    const handleLike = async () => {
        const newStatus = !isLiked;
        onLikeUpdate(newStatus);
        try {
            await sendReaction();
        } catch (err) {
            console.error("Error sending reaction: ", err);
            onLikeUpdate(!newStatus);
        }
    }

    // --- CLASS CHUNG CHO CÁC NÚT ---
    // Sử dụng dark:hover:bg-white/10 để tạo hiệu ứng sáng mờ thay vì đen thui
    const actionButtonClass = `
        flex items-center justify-center gap-2 h-10 rounded-lg cursor-pointer
        transition-all duration-200 active:scale-95
        hover:bg-gray-100 dark:hover:bg-white/10
    `;

    return (
        <>
            {/* Stat Bar */}
            <div className="flex flex-wrap gap-4 px-4 py-3 justify-between items-center border-b border-border-light dark:border-border-dark">
                <div
                    className="flex items-center gap-2 cursor-pointer hover:underline decoration-gray-400"
                    onClick={() => setShowReactionsModal(true)}
                >
                    <div className="flex items-center">
                        <ThumbUpAltIcon className="text-primary w-4 h-4" fontSize="small" />
                    </div>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm font-normal hover:text-primary transition-colors">
                        {likes}
                    </p>
                </div>

                <div className="flex items-center gap-4 text-text-light-secondary dark:text-text-dark-secondary text-sm">
                    <span className="cursor-pointer hover:underline" onClick={() => setShowCommentsModal(true)}>
                        {comments} Comments
                    </span>
                    <div
                        className="flex items-center gap-2 cursor-pointer hover:underline decoration-gray-400"
                        onClick={() => setShowSharesModal(true)}
                    >
                        <span>{shares} Shares</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-1 px-2 py-1">
                {/* LIKE BUTTON */}
                <button
                    className={`${actionButtonClass}`} // Áp dụng class mới
                    onClick={handleLike}
                >
                    {isLiked ? (
                        <ThumbUpAltIcon fontSize="small" className="text-primary transition-all" />
                    ) : (
                        <ThumbUpAltOutlinedIcon
                            fontSize="small"
                            className="text-gray-500 dark:text-gray-300 transition-all group-hover:text-primary"
                        />
                    )}
                    <span className={`font-semibold text-sm ${isLiked ? 'text-primary' : 'text-gray-600 dark:text-gray-300'}`}>
                        Like
                    </span>
                </button>

                {/* COMMENT BUTTON */}
                <button
                    className={`${actionButtonClass} text-text-light-secondary dark:text-text-dark-secondary`}
                    onClick={() => setShowCommentsModal(true)}
                >
                    <ChatBubbleOutlineIcon
                        fontSize="small"
                        className="transition-all text-gray-500 dark:text-gray-300"
                    />
                    <span className="font-semibold text-sm text-gray-600 dark:text-gray-300">Comment</span>
                </button>

                {/* SHARE BUTTON */}
                <button
                    className={`${actionButtonClass} ${isShared ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-300'}`}
                    onClick={handleShare}
                >
                    {isShared ? (
                        <ShareIcon fontSize="small" className="transition-all" />
                    ) : (
                        <ShareOutlinedIcon fontSize="small" className="transition-all" />
                    )}

                    {loadingShare ? <CircularProgress size={16} color="inherit" /> :
                        <span className={`font-semibold text-sm transition-all ${isShared ? '' : 'text-gray-600 dark:text-gray-300'}`}>
                            Share
                        </span>}
                </button>
            </div>

            {/* Modals */}
            {showReactionsModal && (
                <ReactionsListModal
                    postId={postId}
                    onClose={() => setShowReactionsModal(false)}
                />
            )}
            {showSharesModal && (
                <SharesListModal
                    postId={postId}
                    onClose={() => setShowSharesModal(false)}
                />
            )}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            {showCommentsModal && (
                <PostCommentsModal
                    open={showCommentsModal}
                    onClose={() => setShowCommentsModal(false)}
                    postId={postId}
                    postData={postData}
                    onCommentSuccess={onCommentUpdate}
                />
            )}
        </>
    );
}