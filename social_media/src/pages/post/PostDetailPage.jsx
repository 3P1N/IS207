import { useContext } from "react";
import { useParams } from "react-router-dom";
// 1. Import hook
import { useQuery } from "@tanstack/react-query";
import PostCard from "./PostCard.jsx";
import CommentsSection from "./comment_session/CommentsSection.jsx";
import { api } from "../../shared/api.js";
import { AuthContext } from "../../router/AuthProvider.jsx";

export default function PostDetailPage() {
    const { postId } = useParams();
    // const { token } = useContext(AuthContext); // React Query tự dùng axios instance (api) nên thường không cần token thủ công ở đây nếu api đã cấu hình interceptor

    // --- 1. HÀM FETCH DATA ---
    const fetchPostDetail = async () => {
        const response = await api.get(`/posts/${postId}`);
        return response.data;
    };

    // --- 2. SỬ DỤNG USEQUERY ---
    const { data: postData, isLoading, isError } = useQuery({
        // Key phụ thuộc postId, đổi ID là tự fetch lại
        queryKey: ["post", postId], 
        queryFn: fetchPostDetail,
        // Chỉ chạy khi có postId
        enabled: !!postId, 
        // Cache trong 60s (nếu user back ra rồi vào lại ngay thì không load lại)
        staleTime: 300 * 1000, 
        // Tắt tính năng tự fetch lại khi switch tab (tùy chọn)
        refetchOnWindowFocus: false,
    });

    // --- 3. RENDER ---
    return (
        <div className="mt-6 flex flex-col gap-6">
            {isLoading ? (
                <div className="flex justify-center items-center h-[80vh]">
                    <span className="text-gray-500 text-lg">Đang tải bài viết...</span>
                </div>
            ) : isError || !postData ? (
                <div className="flex justify-center items-center h-[80vh]">
                    <span className="text-gray-500 text-lg">
                        Bài viết không tồn tại hoặc đã bị xóa.
                    </span>
                </div>
            ) : (
                <>
                    {/* Truyền dữ liệu vào PostCard */}
                    <PostCard postData={postData} />
                    
                    {/* CommentsSection có thể tự quản lý fetch comment của riêng nó */}
                    <CommentsSection postId={postId} />
                </>
            )}
        </div>
    );
}