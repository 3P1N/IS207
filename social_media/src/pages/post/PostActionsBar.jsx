// src/components/Post/PostActionsBar.jsx
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";
import ReactionsListModal from "./reaction/ReactionListModal";
export default function PostActionsBar({ likes, comments, shares, isLiked, postId }) {
    const navigate = useNavigate();
    const [liked, setLiked] = useState(isLiked);
    
    // State quản lý hiển thị Modal danh sách like
    const [showReactionsModal, setShowReactionsModal] = useState(false);

    const sendReaction = async () => {
        console.log("postId: ", postId);
        const response = await api.post(`/posts/${postId}/reaction`);
        return response;
    }

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
                    <span className="cursor-pointer hover:underline" onClick={() => navigate(`/post/${postId}`)}>
                        {comments} Comments
                    </span>
                    <span>{shares} Shares</span>
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
                    onClick={() => navigate(`/post/${postId}`)}
                >
                    <ChatBubbleOutlineIcon
                        fontSize="small"
                        className="transition-all text-inherit group-hover:text-primary"
                    />
                    <span className="font-semibold text-sm">Comment</span>
                </button>
                <button className="flex items-center justify-center gap-2 h-10 rounded-lg text-text-light-secondary dark:text-text-dark-secondary hover:bg-hover-light dark:hover:bg-hover-dark">
                    <span className="font-semibold text-sm">Share</span>
                </button>
            </div>

            {/* Render Modal nếu showReactionsModal === true */}
            {showReactionsModal && (
                <ReactionsListModal 
                    postId={postId} 
                    onClose={() => setShowReactionsModal(false)} 
                />
            )}
        </>
    );
}