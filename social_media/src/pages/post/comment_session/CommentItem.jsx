import { useContext, useState, useRef, useEffect } from 'react';
import CommentInput from './CommentInput';
import AvatarUser from "../../../shared/components/AvatarUser";
import { AuthContext } from '../../../router/AuthProvider';
import { api } from '../../../shared/api';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
// import CommentReactionsListModal from '../reaction/ReactionsListModal';
import CommentReactionsListModal from '../reaction/CommentReactionsListModal';

export default function CommentItem({ comment, comments, setComments }) {
    const { userData, token } = useContext(AuthContext);
    const isOwner = comment.user.id === userData.id;
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [liked, setLiked] = useState(comment.is_liked);
    const [likeCount, setLikeCount] = useState(comment.reactions_count);
    const [showReactions, setShowReactions] = useState(false);

    const [loading, setLoading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
        setLoading(true);
        try {
            await api.delete(`posts/${comment.post_id}/comments/${comment.id}`);
            setComments(prev => prev.filter(c => c.id !== comment.id));
            setSnackbar({ open: true, message: 'Delete comment successfully', severity: 'success' });

        } catch (err) {
            console.log("lỗi khi delete comment: ", err);
            setSnackbar({ open: true, message: 'Failed to delete comment', severity: 'error' });
        } finally {
            setLoading(false);
            setMenuOpen(false);
        }
    }

    const editComment = () => {
        setIsEditing(true);
        setMenuOpen(false);
    };

    const saveEdit = async () => {
        if (!editContent.trim()) return; // không cho rỗng

        setLoading(true);
        try {
            const response = await api.patch(
                `posts/${comment.post_id}/comments/${comment.id}`,
                { content: editContent },
            );

            // Cập nhật state comments
            setComments(prev => prev.map(c => c.id === comment.id ? { ...c, content: editContent } : c));

            setSnackbar({ open: true, message: 'Comment updated successfully', severity: 'success' });
            setIsEditing(false);
        } catch (err) {
            console.log("Lỗi khi update comment:", err);
            setSnackbar({ open: true, message: 'Failed to update comment', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const cancelEdit = () => {
        setEditContent(comment.content);
        setIsEditing(false);
    };

    const toggleLike = async () => {
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikeCount(prev => newLikedState ? prev + 1 : prev - 1); // Tăng giảm số lượng ngay lập tức

        try {
            // Gọi API like comment
            const response = await api.post(`posts/${comment.post_id}/comments/${comment.id}/reactions`);
            console.log(response.data);
        } catch (error) {
            console.error("Lỗi like comment", error);
            // Rollback nếu lỗi
            setLiked(!newLikedState);
            setLikeCount(prev => !newLikedState ? prev + 1 : prev - 1);
        }
    }

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    }
    // console.log("Comment Data Check:", comment.id, comment.post_id);
    return (
        <div className="flex items-start gap-3 relative">
            <AvatarUser userData={comment.user} />
            <div className="flex-1 flex flex-col items-start">
                <div className="flex items-center justify-between relative">
                    {/* Comment box */}
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 flex flex-col max-w-[80%]">
                        <p className="font-semibold text-sm">{comment.user.name}</p>

                        {isEditing ? (
                            <div className="flex flex-col gap-2">
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none"
                                    rows={2}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={saveEdit}
                                        disabled={loading}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                    >
                                        {loading ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        disabled={loading}
                                        className="bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm">{comment.content}</p>
                        )}
                        {likeCount > 0 && (
                            <div
                                className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-700 shadow-md border border-gray-200 dark:border-gray-600 rounded-full py-[2px] px-[6px] flex items-center gap-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all z-10"
                                onClick={() => setShowReactions(true)}
                            >
                                <div className="bg-primary rounded-full p-[2px] flex items-center justify-center">
                                    <ThumbUpAltIcon sx={{ width: 10, height: 10, color: 'blue' }} />
                                </div>
                                <span className="text-xs text-text-light-secondary dark:text-text-dark-secondary font-medium leading-none">
                                    {likeCount}
                                </span>
                            </div>
                        )}
                    </div>


                    {/* Nút menu */}
                    {isOwner && (
                        <div className="relative ml-2" ref={menuRef}>
                            <button
                                className="text-sm font-bold px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-center"
                                onClick={() => setMenuOpen(!menuOpen)}
                                disabled={loading}
                            > ...
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
                                        {loading ? <CircularProgress size={16} /> : <> Delete </>}

                                    </button>

                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex gap-4 text-xs font-semibold text-text-light-secondary dark:text-text-dark-secondary px-3 py-1">

                    {/* Nút Like */}
                    <button
                        onClick={toggleLike}

                        className="flex items-center gap-1 hover:underline cursor-pointer"
                    >
                        {liked ? (
                            <ThumbUpAltIcon fontSize="small" color="primary" />
                        ) : (
                            <ThumbUpOffAltIcon fontSize="small" />
                        )}

                    </button>

                    {/* Nút Reply */}
                    <button className="hover:underline cursor-pointer">Reply</button>
                </div>

            </div>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            {showReactions && (
                <CommentReactionsListModal
                    commentId={comment.id} // Hoặc postId tùy API của bạn
                    postId={comment.post_id}
                    onClose={() => setShowReactions(false)} 
                />
            )}
        </div>
    );
}
