// src/components/Post/PostActionsBar.jsx
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../router/AuthProvider";
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

export default function PostActionsBar({ likes, comments, shares, isShared, isLiked, postId, postData }) {
    const navigate = useNavigate();
    const [liked, setLiked] = useState(isLiked);
    const [shared, setShared] = useState(isShared);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // success | error
const [showCommentsModal, setShowCommentsModal] = useState(false);
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    const [loadingShare, setLoadingShared] = useState(false);
    // State quản lý hiển thị Modal danh sách like
    const [showReactionsModal, setShowReactionsModal] = useState(false);
    const [showSharesModal, setShowSharesModal] = useState(false);
    console.log("is shared: ", isShared);

    const sendReaction = async () => {
        console.log("postId: ", postId);
        const response = await api.post(`/posts/${postId}/reaction`);
        return response;
    }

    const sharePost = async () => {
        const response = await api.post(`/posts/${postId}/share`);
        return response.data;
    }
    const handleShare = async () => {
        const prevShared = shared;
        setShared(!shared);
        setLoadingShared(true);

        try {
            const response = await sharePost(); // gọi API share
            setSnackbarMessage(!prevShared ? "Post shared successfully!" : "Share cancelled!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (err) {
            console.log("Error sharing post: ", err);
            setShared(prevShared); // rollback nếu thất bại
            setSnackbarMessage(!prevShared ? "Failed to share the post!" : "Failed to cancel share!");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoadingShared(false);
        }
    };



    const handleLike = async () => {
        const prevLiked = liked;
        setLiked(!liked);

        try {
            const response = await sendReaction();
            console.log(response.data);
        } catch (err) {
            console.log("lỗi khi gửi post reaction: ", err);
            setLiked(prevLiked);
        }
    }

    return (
        <>
            {/* Stat Bar */}
            <div className="flex flex-wrap gap-4 px-4 py-3 justify-between items-center border-b border-border-light dark:border-border-dark">
                {/* Khu vực hiển thị số Like - Click vào đây sẽ mở Modal */}
                <div
                    className="flex items-center gap-2 cursor-pointer hover:underline decoration-gray-400"
                    onClick={() => setShowReactionsModal(true)}
                >
                    <div className="flex items-center">
                        {/* Biểu tượng Likes */}
                        <ThumbUpAltIcon className="text-primary w-4 h-4" fontSize="small" />
                        {/* Bạn có thể dùng icon màu xanh để biểu thị danh sách like */}
                    </div>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm font-normal hover:text-primary transition-colors">
                        {likes}
                    </p>
                </div>

                <div className="flex items-center gap-4 text-text-light-secondary dark:text-text-dark-secondary text-sm">
                    {/* Click comment thì navigate hoặc mở modal comment tùy bạn */}
                    <span className="cursor-pointer hover:underline" onClick={() => setShowCommentsModal(true)}>
                        {comments} Comments
                    </span>
                    <div
                        className="flex items-center gap-2 cursor-pointer hover:underline decoration-gray-400"
                        onClick={() => setShowSharesModal(true)}
                    >
                        <span >{shares} Shares</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-1 px-2 py-1">
                <button
                    className={`
                        flex items-center justify-center gap-2 h-10 rounded-lg cursor-pointer
                        transition-all
                        hover:bg-gray-100 dark:hover:bg-gray-700
                    `}
                    onClick={handleLike}
                >
                    {liked ? (
                        <ThumbUpAltIcon fontSize="small" className="text-primary transition-all" />
                    ) : (
                        <ThumbUpAltOutlinedIcon
                            fontSize="small"
                            className="text-gray-500 dark:text-gray-300 transition-all group-hover:text-primary"
                        />
                    )}
                    <span className={`font-semibold text-sm ${liked ? 'text-primary' : ''}`}>Like</span>
                </button>

                <button
                    className="
                        flex items-center justify-center gap-2 h-10 rounded-lg
                        cursor-pointer transition-all
                        text-text-light-secondary dark:text-text-dark-secondary
                        hover:bg-gray-100 dark:hover:bg-gray-700
                    "
                    onClick={() => setShowCommentsModal(true)}
                >
                    <ChatBubbleOutlineIcon
                        fontSize="small"
                        className="transition-all text-inherit group-hover:text-primary"
                    />
                    <span className="font-semibold text-sm">Comment</span>
                </button>
                <button
                    className={`
                        flex items-center justify-center gap-2 h-10 rounded-lg
                        transition-all
                        ${shared ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-300'}
                        hover:bg-gray-100 dark:hover:bg-gray-700
                        cursor-pointer
                    `}
                    onClick={handleShare}
                >
                    {shared ? (
                        <ShareIcon fontSize="small" className="transition-all" />
                    ) : (
                        <ShareOutlinedIcon fontSize="small" className="transition-all" />
                    )}

                    {loadingShare ? <CircularProgress size={16} color="inherit" /> :
                        <span className={`font-semibold text-sm transition-all`}>
                            Share
                        </span>}

                </button>

            </div>

            {/* Render Modal nếu showReactionsModal === true */}
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
                    postData={postData} // Cần truyền postData xuống để hiển thị Header
                />
            )}
        </>
    );
}