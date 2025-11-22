import { useContext, useState, useRef, useEffect } from 'react';
import CommentInput from './CommentInput'; // Sử dụng CommentInput cho phần Reply
import AvatarUser from "../../../shared/components/AvatarUser";
import { AuthContext } from '../../../router/AuthProvider';
import { api } from '../../../shared/api';

export default function CommentItem({ comment }) {
    const { userData } = useContext(AuthContext);
    const isOwner = comment.user.id === userData.id;
    const [loading, setLoading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const deleteComment = async () => {
        setLoading(true)
        try{
            await api.delete(`posts/${comment.post_id}/comments/${comment.id}`,{
                headers: { Authorization: `Bearer ${token}` } 
            });
        }catch(err){
            console.log("lỗi khi delete comment: ",err);
        }finally{
            setLoading(false);
            setMenuOpen(false);

        }

        // console.log("delete comment: ", comment.id);
    }

    const editComment = () => {
        console.log("edit comment: ", comment.id);
        setMenuOpen(false);
    }

    return (
        <div className="flex items-start gap-3 relative">
            <AvatarUser userData={comment.user} />
            <div className="flex-1 flex flex-col items-start">
                <div className="flex items-center justify-between relative">
                    {/* Comment box */}
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 flex flex-col max-w-[80%]">
                        <p className="font-semibold text-sm">{comment.user.name}</p>
                        <p className="text-sm">{comment.content}</p>
                    </div>

                    {/* Nút menu */}
                    {isOwner && (
                        <div className="relative ml-2" ref={menuRef}>
                            <button
                                className="text-sm font-bold px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                …
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-24 bg-white dark:bg-gray-800 shadow-md rounded border border-gray-200 dark:border-gray-700 z-10">
                                    <button
                                        onClick={editComment}
                                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={deleteComment}
                                        className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>


                <div className="flex gap-3 text-xs font-semibold text-text-light-secondary dark:text-text-dark-secondary px-3 py-1">
                    <button className="hover:underline">Like</button>
                    <button className="hover:underline">Reply</button>
                    {/* <span>· {comment.timeAgo}</span> */}
                </div>

                {/* HIỂN THỊ PHẢN HỒI (REPLIES) */}
                {/* {hasReplies && (
                    <div className="flex flex-col gap-2 mt-2 w-full">
                        {comment.replies.map((reply, index) => (
                            <ReplyItem key={index} reply={reply} />
                        ))}
                    </div>
                )} */}
            </div>
        </div>
    );
}

// Component phụ cho Reply (giữ nguyên)
function ReplyItem({ reply }) {
    return (
        <div className="flex items-start gap-3">
            <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8"
                data-alt={`${reply.author.name}'s profile picture`}
                style={{ backgroundImage: `url(${reply.author.profilePicture})` }}
            />
            <div className="flex-1 flex flex-col items-start">
                <div className="bg-background-light dark:bg-background-dark rounded-xl px-3 py-2">
                    <p className="font-semibold text-sm">{reply.author.name}</p>
                    <p className="text-sm">{reply.text}</p>
                </div>
                <div className="flex gap-3 text-xs font-semibold text-text-light-secondary dark:text-text-dark-secondary px-3 py-1">
                    <button className="hover:underline">Like</button>
                    <button className="hover:underline">Reply</button>
                    <span>· {reply.timeAgo}</span>
                </div>
            </div>
        </div>
    );
}
