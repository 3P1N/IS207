// src/components/Post/CommentsSection/CommentInput.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import './CommentInput.css';
import { api } from "../../../shared/api";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../router/AuthProvider";
import AvatarUser from "../../../shared/components/AvatarUser";


export default function CommentInput({
    currentUserProfile,
    postId,
    comments,
    // onCommentSuccess,
    setComments,
    placeholder = "Write a comment...",
    
}) {
    const [content, setContent] = useState("");
    const textareaRef = useRef(null);
    const [loading, setLoading] = useState(false);
    // const {  } = useContext(AuthContext);

    // auto-resize textarea
    const resize = () => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = `${ta.scrollHeight + 2}px`;
    };

    useEffect(() => {
        resize();
    }, [content]);

    const handleChange = (e) => {
        setContent(e.target.value);
    };

    const sendComment = async () => {
        // trả về response.data (giả sử API trả về comment vừa tạo)
        const response = await api.post(
            `/posts/${postId}/comments`,
            { content }
        );
        return response.data.comment;
    };

    // Submit handler
    const handlePost = async () => {
        if (!content.trim()) return;
        if (loading) return; // tránh double submit
        setLoading(true);
        try {
            const newComment = await sendComment();

            // nếu API trả về comment mới, thêm vào danh sách (đưa lên đầu)
            if (newComment) {
                setComments(prev => [newComment, ...(prev || [])]);
            }
            if (onCommentSuccess) {
                    onCommentSuccess(); 
                }

            // clear input
            setContent("");
        } catch (err) {
            console.log("lỗi khi gửi comment: ", err);
            // bạn có thể show toast / snackbar lỗi ở đây
        } finally {
            setLoading(false);
        }
    };

    // Allow Ctrl/Cmd + Enter to post
    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            handlePost();
        }
    };

    const isEmpty = content.trim().length === 0;

    return (
        <div className="flex items-start gap-3">
            
            <AvatarUser userData={currentUserProfile} />
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
                        value={content}             // <-- dùng value thay vì content
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        style={{ lineHeight: "1.4rem" }}
                        aria-label="Write a comment"
                    />
                </div>

                <div className="flex items-center justify-between mt-2">
                    {/* Left: icons */}
                    <div className="flex items-center gap-2">
                        <Tooltip title="Add emoji">
                            <IconButton size="small">
                                <InsertEmoticonIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Add image">
                            <IconButton size="small">
                                <ImageIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </div>

                    {/* Right: Post button */}
                    <div className="flex items-center gap-2">
                        <div className="text-xs text-text-light-secondary dark:text-text-dark-secondary mr-2 hidden sm:block">
                            {content.length > 0 ? `${content.length} chars` : ""}
                        </div>

                        <button
                            onClick={handlePost}
                            disabled={isEmpty || loading}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all
                                ${isEmpty || loading
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed opacity-80"
                                    : "bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"}
                            `}
                            title={isEmpty ? "Type a comment to enable" : "Post comment (Ctrl/Cmd + Enter)"}
                        >
                            {loading ? (
                                <CircularProgress size={18} />      // spinner khi loading
                            ) : (
                                <SendIcon fontSize="small" />
                            )}
                            <span className="hidden sm:inline">{loading ? "Posting..." : "Post"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
