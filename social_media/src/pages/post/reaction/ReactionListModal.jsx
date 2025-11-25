// src/components/Post/ReactionsListModal.jsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { api } from "../../../shared/api";
import AvatarUser from "../../../shared/components/AvatarUser";

export default function ReactionsListModal({ postId, onClose }) {
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data khi modal mở
    useEffect(() => {
        const fetchReactions = async () => {
            try {
                const response = await api.get(`/posts/${postId}/reactions`);
                // Giả sử API trả về mảng user hoặc object có chứa mảng user
                setLikes(response.data); 
            } catch (error) {
                console.error("Failed to load reactions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReactions();
    }, [postId]);

    // Đóng bằng phím ESC
    useEffect(() => {
        const handleEsc = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return createPortal(
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-card-dark w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                onClick={(e) => e.stopPropagation()} // Chặn click đóng khi bấm vào nội dung
            >
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Likes</h3>
                    <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* List Users */}
                <div className="overflow-y-auto p-4 flex-1">
                    {loading ? (
                        <div className="flex justify-center py-4">
                            <span className="loading-spinner text-primary">Loading...</span> 
                        </div>
                    ) : likes.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">Chưa có ai like bài viết này.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {likes.map((like) => (
                                <div key={like.id} className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors cursor-pointer">
                                    {/* Avatar */}
                                   <AvatarUser userData={like.user}/>
                                    {/* Name */}
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{like.user.name}</p>
                                        {/* Có thể thêm bio hoặc mutual friends nếu có */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}