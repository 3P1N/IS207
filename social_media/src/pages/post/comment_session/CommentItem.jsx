import { useContext, useState, useRef, useEffect } from 'react';
// import CommentInput from './CommentInput'; // Nếu bạn muốn dùng component nhập liệu riêng
import AvatarUser from "../../../shared/components/AvatarUser";
import { AuthContext } from '../../../router/AuthProvider';
import { api } from '../../../shared/api';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import SendIcon from '@mui/icons-material/Send'; // Import thêm icon gửi
import CommentReactionsListModal from '../reaction/CommentReactionsListModal';

// Thêm prop isChild (mặc định false) để kiểm tra cấp độ comment
export default function CommentItem({ comment, comments, setComments, isChild = false }) {
    const { userData } = useContext(AuthContext);
    const isOwner = comment.user.id === userData.id;

    // State cho comment hiện tại
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [liked, setLiked] = useState(comment.is_liked);
    const [likeCount, setLikeCount] = useState(comment.reactions_count);
    const [showReactions, setShowReactions] = useState(false);

    // State quản lý comment con (QUAN TRỌNG)
    // Khởi tạo từ props, nếu không có thì là mảng rỗng
    const [childComments, setChildComments] = useState(comment.children_recursive || []);

    // State cho chức năng Reply
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [replyLoading, setReplyLoading] = useState(false);

    const [loading, setLoading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const menuRef = useRef(null);

    // Đồng bộ lại childComments nếu props thay đổi (tùy chọn, tốt cho realtime)
    useEffect(() => {
        if (comment.children_recursive) {
            setChildComments(comment.children_recursive);
        }
    }, [comment.children_recursive]);

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

    // --- CÁC HÀM XỬ LÝ CŨ (DELETE, EDIT, LIKE) ---
    const deleteComment = async () => {
        setLoading(true);
        try {
            await api.delete(`posts/${comment.post_id}/comments/${comment.id}`);
            // Hàm setComments này sẽ xóa comment khỏi danh sách của cha (hoặc root)
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
        if (!editContent.trim()) return;

        setLoading(true);
        try {
            await api.patch(
                `posts/${comment.post_id}/comments/${comment.id}`,
                { content: editContent },
            );
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
        setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);

        try {
            await api.post(`posts/${comment.post_id}/comments/${comment.id}/reactions`);
            console.log("like comment: ", comment.post_id, comment.id)
        } catch (error) {
            console.error("Lỗi like comment", error);
            setLiked(!newLikedState);
            setLikeCount(prev => !newLikedState ? prev + 1 : prev - 1);
        }
    }

    // --- HÀM MỚI: XỬ LÝ REPLY ---
    const handleReplySubmit = async () => {
        if (!replyContent.trim()) return;

        setReplyLoading(true);
        try {
            const response = await api.post(`posts/${comment.post_id}/comments/${comment.id}/replies`, {
                content: replyContent,
            });
            // response.data trả về object comment mới
            const newComment = response.data;

            // Cập nhật danh sách comment con
            // Giả sử API trả về đúng format comment, ta cần thêm child_comments: [] cho nó an toàn
            const newCommentFormatted = { ...newComment, child_comments: [] };

            setChildComments(prev => [...prev, newCommentFormatted]);

            // Reset form
            setReplyContent('');
            setIsReplying(false);
            setSnackbar({ open: true, message: 'Replied successfully', severity: 'success' });

        } catch (error) {
            console.error("Lỗi reply comment", error);
            setSnackbar({ open: true, message: 'Failed to reply', severity: 'error' });
        } finally {
            setReplyLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    }

    return (
        <div className="flex flex-col w-full"> {/* Bọc ngoài bằng flex-col để chứa children bên dưới */}

            {/* PHẦN HIỂN THỊ COMMENT CHÍNH */}
            <div className="flex items-start gap-3 relative">
                <AvatarUser userData={comment.user} />
                <div className="flex-1 flex flex-col items-start">
                    <div className="flex items-center justify-between relative w-full">
                        {/* Comment box */}
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 flex flex-col max-w-[90%]"> {/* Tăng max-width lên chút */}
                            <p className="font-semibold text-sm">{comment.user.name}</p>

                            {isEditing ? (
                                <div className="flex flex-col gap-2 min-w-[200px]">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none text-sm"
                                        rows={2}
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={saveEdit} disabled={loading} className="bg-blue-600 text-white px-3 py-1 rounded text-xs">
                                            {loading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button onClick={cancelEdit} disabled={loading} className="bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded text-xs">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm break-words whitespace-pre-wrap">{comment.content}</p>
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

                        {/* Nút menu (3 chấm) */}
                        {isOwner && (
                            <div className="relative ml-2" ref={menuRef}>
                                <button
                                    className="text-sm font-bold px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-center"
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    disabled={loading}
                                > ... </button>

                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-24 bg-white dark:bg-gray-800 shadow-md rounded border border-gray-200 dark:border-gray-700 z-20">
                                        <button onClick={editComment} className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                                            Edit
                                        </button>
                                        <button onClick={deleteComment} className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                                            {loading ? <CircularProgress size={16} /> : <>Delete</>}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Action Bar: Like, Reply */}
                    <div className="flex gap-4 text-xs font-semibold text-text-light-secondary dark:text-text-dark-secondary px-3 py-1 mt-1">
                        <button onClick={toggleLike} className="flex items-center gap-1 hover:underline cursor-pointer">
                            {liked ? <ThumbUpAltIcon fontSize="small" color="primary" /> : <ThumbUpOffAltIcon fontSize="small" />}
                            Like
                        </button>


                        <button
                            className="hover:underline cursor-pointer"
                            onClick={() => setIsReplying(!isReplying)}
                        >
                            Reply
                        </button>


                        <span className="text-gray-400 font-normal">
                            {/* Hiển thị thời gian (nếu muốn) */}
                            {/* {new Date(comment.created_at).toLocaleDateString()} */}
                        </span>
                    </div>

                    {/* Ô NHẬP LIỆU REPLY (Chỉ hiển thị khi bấm Reply) */}
                    {isReplying && (
                        <div className="flex items-start gap-2 w-full mt-2 animate-fadeIn">
                            {/* Avatar người đang login (User hiện tại) */}
                            <AvatarUser userData={userData} size={30} />
                            <div className="flex-1 relative">
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder={`Reply to ${comment.user.name}...`}
                                    className="w-full p-2 pr-10 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 text-sm bg-gray-50 dark:bg-gray-900 resize-none"
                                    rows={1}
                                    autoFocus
                                />
                                <button
                                    onClick={handleReplySubmit}
                                    disabled={replyLoading || !replyContent.trim()}
                                    className="absolute right-2 bottom-1.5 text-blue-600 disabled:text-gray-400 hover:bg-blue-100 rounded-full p-1 transition-all"
                                >
                                    {replyLoading ? <CircularProgress size={16} /> : <SendIcon fontSize="small" />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* HIỂN THỊ DANH SÁCH CHILD COMMENTS */}
            {childComments && childComments.length > 0 && (
                <div className="flex flex-col gap-3 mt-3 ml-12 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                    {childComments.map((childComment) => (
                        <CommentItem
                            key={childComment.id}
                            comment={childComment}
                            // QUAN TRỌNG: setComments ở đây là setChildComments của cha
                            // Điều này giúp hàm delete/edit của con tự động cập nhật list con của cha
                            setComments={setChildComments}
                            comments={childComments}
                            isChild={true} // Đánh dấu đây là comment con để ẩn nút Reply
                        />
                    ))}
                </div>
            )}

            {/* Snackbar thông báo */}
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

            {/* Modal Reaction */}
            {showReactions && (
                <CommentReactionsListModal
                    commentId={comment.id}
                    postId={comment.post_id}
                    onClose={() => setShowReactions(false)}
                />
            )}
        </div>
    );
}