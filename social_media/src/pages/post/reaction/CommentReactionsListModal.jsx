import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query"; // Không cần useQueryClient
import { api } from "../../../shared/api";
import AvatarUser from "../../../shared/components/AvatarUser";
import { CircularProgress } from "@mui/material";


export default function CommentReactionsListModal({ postId, commentId, onClose }) {

    // --- SỬ DỤNG USEQUERY ---
    const { data: likes = [], isLoading } = useQuery({
        // Key này là duy nhất cho mỗi comment, khi commentId đổi, nó tự fetch cái mới
        queryKey: ['reactions', 'post', postId, 'comment', commentId], 
        
        queryFn: async () => {
            // Đảm bảo đường dẫn API chính xác
            const response = await api.get(`/posts/${postId}/comments/${commentId}/reactions`);
            return response.data;
        },
        
        // Chỉ fetch khi có đủ ID. Nếu postId bị undefined, nó sẽ không chạy.
        enabled: Boolean(postId) && Boolean(commentId),
        
        // Cache setting:
        // staleTime: 0 nghĩa là dữ liệu luôn cũ, cần fetch lại nếu gặp lại key này
        staleTime: 1000 * 30, // (Tùy chọn) Cache trong 30s để tránh spam request nếu user tắt đi bật lại liên tục
        gcTime: 1000 * 60 * 5, // Giữ trong bộ nhớ 5 phút (React Query v5 đổi cacheTime thành gcTime)
    });

    // --- BỎ USEEFFECT INVALIDATE THỪA THÃI --- 
    // React Query tự động xử lý việc fetch khi Key thay đổi.

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
                onClick={(e) => e.stopPropagation()}
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
                    {/* Kiểm tra cả trường hợp postId bị thiếu */}
                    {(!postId || !commentId) ? (
                         <p className="text-center text-red-500 py-4">Error: Missing ID info</p>
                    ) : isLoading ? (
                        <div className="flex justify-center py-4">
                            <CircularProgress size={30} /> 
                            {/* Nhớ import CircularProgress hoặc dùng thẻ span loading */}
                        </div>
                    ) : likes.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No one has liked this comment yet.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {likes.map((like) => (
                                <div key={like.id ?? like.user?.id} className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors cursor-pointer">
                                    <AvatarUser userData={like.user} />
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{like.user?.name}</p>
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