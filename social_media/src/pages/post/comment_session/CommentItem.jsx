import { useContext, useState, useRef, useEffect } from 'react';
import CommentInput from './CommentInput';
import AvatarUser from "../../../shared/components/AvatarUser";
import { AuthContext } from '../../../router/AuthProvider';
import { api } from '../../../shared/api';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function CommentItem({ comment, comments, setComments }) {
    const { userData, token } = useContext(AuthContext);
    const isOwner = comment.user.id === userData.id;
    
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
            await api.delete(`posts/${comment.post_id}/comments/${comment.id}`, {
                headers: { Authorization: `Bearer ${token}` } 
            });
            setComments(prev => prev.filter(c => c.id !== comment.id));
            setSnackbar({ open: true, message: 'Delete comment successfully', severity: 'success' });

        } catch(err) {
            console.log("lỗi khi delete comment: ", err);
            setSnackbar({ open: true, message: 'Failed to delete comment', severity: 'error' });
        } finally {
            setLoading(false);
            setMenuOpen(false);
        }
    }

    const editComment = () => {
        console.log("edit comment: ", comment.id);
        setMenuOpen(false);
    }

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
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
                                className="text-sm font-bold px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded flex items-center justify-center"
                                onClick={() => setMenuOpen(!menuOpen)}
                                disabled={loading}
                            >
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
                                        {loading? <CircularProgress size={16}/> :<> Delete </> }
                                        
                                    </button>
                                    
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex gap-3 text-xs font-semibold text-text-light-secondary dark:text-text-dark-secondary px-3 py-1">
                    <button className="hover:underline">Like</button>
                    <button className="hover:underline">Reply</button>
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
        </div>
    );
}
