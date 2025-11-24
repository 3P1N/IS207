import { useContext } from 'react';
import { useParams } from 'react-router-dom';
// 1. Import hooks React Query
import { useQuery, useQueryClient } from '@tanstack/react-query';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';
import { AuthContext } from '../../../router/AuthProvider';
import { api } from '../../../shared/api';

export default function CommentsSection() {
    const { postId } = useParams();
    const { userData } = useContext(AuthContext);
    
    // Dùng queryClient để cập nhật cache thủ công (giả lập setComments)
    const queryClient = useQueryClient();

    // --- 1. FETCH DATA ---
    const fetchComments = async () => {
        const response = await api.get(`/posts/${postId}/comments`);
        return response.data;
    };

    // --- 2. SỬ DỤNG USEQUERY ---
    const { data: comments = [], isLoading } = useQuery({
        queryKey: ['comments', postId], // Key phụ thuộc postId
        queryFn: fetchComments,
        enabled: !!postId,
        staleTime: 30 * 1000, // Cache 30s
    });

    // --- 3. HÀM GIẢ LẬP SETSTATE (Cầu nối quan trọng) ---
    // Vì CommentInput và CommentItem dùng props setComments để thêm/xóa/sửa mảng local,
    // ta dùng hàm này để cập nhật trực tiếp vào Cache của React Query.
    const setComments = (updater) => {
        queryClient.setQueryData(['comments', postId], (oldData) => {
            // Nếu updater là hàm (vd: prev => [...prev, new]), thực thi nó với oldData
            if (typeof updater === 'function') {
                return updater(oldData || []);
            }
            // Nếu updater là giá trị trực tiếp
            return updater;
        });
    };

    return (
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-4 flex flex-col gap-4">
            {/* Khung nhập bình luận */}
            <CommentInput
                currentUserProfile={userData}
                comments={comments}
                setComments={setComments} // Truyền hàm wrapper vào đây
                postId={postId}
            />
            
            <hr className="border-border-light dark:border-border-dark" />

            {isLoading ? (
                <div className="text-center text-gray-500 py-2"> Loading comments... </div>
            ) : (
                !comments.length ? (
                    <div className="text-center text-gray-500 py-2">No comments yet</div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {comments.map((comment, index) => (
                            <CommentItem 
                                key={comment.id || index} // Ưu tiên dùng ID nếu có
                                comment={comment}
                                setComments={setComments} // Truyền hàm wrapper vào đây
                                comments={comments}
                            />
                        ))}
                    </div>
                )
            )}
        </div>
    );
}