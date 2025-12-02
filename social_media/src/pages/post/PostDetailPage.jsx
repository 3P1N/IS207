import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PostCard from "./PostCard.jsx";
// import CommentsSection from "./comment_session/CommentsSection.jsx";
import { api } from "../../shared/api.js";
import NotFoundPage from "../not-found/NotFoundPage.jsx";

export default function PostDetailPage() {
    const { postId } = useParams();

    // --- 1. HÀM FETCH DATA (Đã sửa ở trên) ---
    const fetchPostDetail = async () => {
        try {
            const response = await api.get(`/posts/${postId}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return { isNotFound: true }; // Trả về data đánh dấu
            }
            throw error;
        }
    };

    // --- 2. SỬ DỤNG USEQUERY ---
    const { data: postData, isLoading, isError } = useQuery({
        queryKey: ["post", postId],
        queryFn: fetchPostDetail,
        enabled: !!postId,
        staleTime: 300 * 1000, // Cache 5 phút
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            // Không cần check 404 ở đây nữa vì 404 giờ là success
            return failureCount < 3; 
        }
    });

    if (postData?.isNotFound) {
        return <NotFoundPage />;
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <span className="text-gray-500 text-lg">Đang tải bài viết...</span>
            </div>
        );
    }

    // --- 5. RENDER ERROR KHÁC (500, Network) ---
    if (isError) {
        return <div>Đã có lỗi xảy ra. Vui lòng thử lại.</div>;
    }

    // --- 6. RENDER GIAO DIỆN CHÍNH ---
    return (
        <div className="mt-6 flex flex-col gap-6">
             <PostCard postData={postData} postId = {postId}/>
             
        </div>
    );
}