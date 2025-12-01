// src/pages/profile/ProfilePost.jsx
import { api } from "../../shared/api";
import PostCard from "../post/PostCard";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProfilePost() {
    const [postsData, setPostsData] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const { profileUser } = useOutletContext();
    const id = profileUser?.id;

    const getPostData = async (urlString = "") => {
        if (loading) return;
        setLoading(true);

        try {
            // 1. QUAN TRỌNG: Base URL phải là bài của user hiện tại
            let url = `/users/${id}/posts`; 

            // 2. Logic xử lý URL thông minh của bạn (Né lỗi http/https CORS)
            if (urlString) {
                // Nếu có urlString (link trang 2, 3...), ta chỉ lấy phần query params (?page=2)
                // ghép vào base URL hiện tại để đảm bảo tính nhất quán.
                try {
                    const urlObj = new URL(urlString); 
                    url += urlObj.search; // Kết quả: /users/1/posts?page=2
                } catch (e) {
                    // Fallback nếu urlString không phải full url
                    if(urlString.includes('?')) url = urlString;
                }
            }

            const response = await api.get(url);
            
            // 3. Lọc trùng lặp (Logic của bạn rất tốt)
            setPostsData((prev) => {
                // Nếu là trang 1 (không có urlString truyền vào) -> Reset luôn cho sạch
                if (!urlString) return response.data.data;

                const newPosts = response.data.data.filter(
                    (p) => !prev.some((old) => old.id === p.id)
                );
                return [...prev, ...newPosts];
            });

            setNextPageUrl(response.data.next_page_url);

        } catch (err) {
            console.log("Lỗi: ", err);
        } finally {
            setLoading(false);
        }
    };

    // Load trang đầu tiên khi ID thay đổi
    useEffect(() => {
        if (id) {
            setPostsData([]); // Clear cũ
            setNextPageUrl(null);
            getPostData(); // Gọi không tham số = trang 1
        }
    }, [id]);

    // Scroll Listener (Dùng Window cho an toàn với mọi Layout)
    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
            
            if (scrollTop + clientHeight >= scrollHeight - 50) { 
                if (nextPageUrl && !loading) {
                    getPostData(nextPageUrl);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [nextPageUrl, loading]);

    return (
        <div className="mt-6 flex flex-col items-center gap-4">
            {postsData.map((post, index) => (
                <div key={`${post.id}-${index}`} className="w-full max-w-xl">
                    <PostCard postData={post} />
                </div>
            ))}
            {loading && <div>Đang tải thêm...</div>}
        </div>
    );
}