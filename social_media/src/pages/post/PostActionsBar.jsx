// src/components/Post/PostActionsBar.jsx
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useState } from "react";

export default function PostActionsBar({ likes, comments, shares, isLiked }) {


    const [liked, setLiked] = useState(isLiked);

    const handleLike = () => {
        setLiked(!liked);
    }


    return (
        <>
            {/* Stat Bar */}
            <div className="flex flex-wrap gap-4 px-4 py-3 justify-between items-center border-b border-border-light dark:border-border-dark">
                <div className="flex items-center gap-2">
                    <div className="flex items-center">
                        {/* Biểu tượng Likes */}
                        <ThumbUpAltOutlinedIcon />
                    </div>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm font-normal">{likes}</p>
                </div>
                <div className="flex items-center gap-4 text-text-light-secondary dark:text-text-dark-secondary text-sm">
                    <span>{comments} Comments</span>
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
                    <span className="font-semibold text-sm">Like</span>
                </button>

                <button
                    className="
                        flex items-center justify-center gap-2 h-10 rounded-lg
                        cursor-pointer transition-all
                        text-text-light-secondary dark:text-text-dark-secondary
                        hover:bg-gray-100 dark:hover:bg-gray-700
                    "
                >
                    <ChatBubbleOutlineIcon
                        fontSize="small"
                        className="transition-all text-inherit group-hover:text-primary"
                    />
                    <span className="font-semibold text-sm">Comment</span>
                </button>
                <button className="flex items-center justify-center gap-2 h-10 rounded-lg text-text-light-secondary dark:text-text-dark-secondary hover:bg-hover-light dark:hover:bg-hover-dark">
                    {/* <span className="material-symbols-outlined">retweet</span> */}
                    <span className="font-semibold text-sm">Share</span>
                </button>
            </div>
        </>
    );
}