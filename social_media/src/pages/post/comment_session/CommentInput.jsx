// src/components/Post/CommentsSection/CommentInput.jsx
import React, { useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import './CommentInput.css';

export default function CommentInput({
    currentUserProfile,
    placeholder = "Write a comment..."
}) {
    const [value, setValue] = useState("");
    const textareaRef = useRef(null);

    // auto-resize textarea
    const resize = () => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        // add a small extra to prevent scrollbar flicker
        ta.style.height = `${ta.scrollHeight + 2}px`;
    };

    useEffect(() => {
        resize();
    }, [value]);

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    // Submit handler (mock)
    const handlePost = () => {
        if (!value.trim()) return;
        // TODO: call API to post comment
        console.log("Posting comment:", value);
        setValue("");
    };

    // Allow Ctrl/Cmd + Enter to post
    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            handlePost();
        }
    };

    const isEmpty = value.trim().length === 0;

    return (
        <div className="flex items-start gap-3">
            {/* Avatar */}
            <div
                className="bg-center bg-no-repeat bg-cover rounded-full size-10 mt-1 shrink-0"
                data-alt="Current user's profile picture"
                style={{
                    backgroundImage: `url("${currentUserProfile?.profilePicture || ''}")`
                }}
            />

            {/* Input area */}
            <div className="flex-1">
                <div className="bg-background-light dark:bg-background-dark rounded-xl p-2 md:p-3">
                    <textarea
                        ref={textareaRef}
                        className="
                            form-textarea w-full resize-none bg-transparent 
                            border-none focus:border-none outline-none focus:outline-none
                            focus:ring-0 p-0 text-sm text-text-light-primary dark:text-text-dark-primary
                            placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary
                            overflow-hidden
                        "
                        placeholder={placeholder}
                        rows={1}
                        value={value}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        style={{ lineHeight: "1.4rem" }}
                        aria-label="Write a comment"
                    />
                </div>

                <div className="flex items-center justify-between mt-2">
                    {/* Left: icons */}


                    {/* Right: Post button */}
                    <div className="flex items-center gap-2">
                        {/* Optional character count, shows only when hover or has text */}
                        <div className="text-xs text-text-light-secondary dark:text-text-dark-secondary mr-2 hidden sm:block">
                            {value.length > 0 ? `${value.length} chars` : ""}
                        </div>

                        <button
                            onClick={handlePost}
                            disabled={isEmpty}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all
                ${isEmpty
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed opacity-80"
                                    : "bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"}
              `}
                            title={isEmpty ? "Type a comment to enable" : "Post comment (Ctrl/Cmd + Enter)"}
                        >
                            <SendIcon fontSize="small" />
                            <span className="hidden sm:inline">Post</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
