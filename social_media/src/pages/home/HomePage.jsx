import { useContext, useEffect, useState, useRef } from "react"; // 1. Thêm useRef
import { api } from "../../shared/api";
import { AuthContext } from "../../router/AuthProvider";
import PostCard from "../post/PostCard";

export default function HomePage() {
    // ... các state cũ giữ nguyên
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const { postsData, setPostsData } = useContext(AuthContext);

    // 2. Tạo Ref cho khung cuộn
    const scrollContainerRef = useRef(null);

    const getPostData = async (urlString = "") => {
        // ... Logic gọi API giữ nguyên như bạn đã sửa ở bước trước
        if (loading) return;
        setLoading(true);
        try {
            let url = "/posts";
            if (urlString && urlString.includes("http")) {
                const urlObj = new URL(urlString);
                url += urlObj.search;
            } else if (urlString) {
                url = urlString;
            }

            const response = await api.get(url);

            setPostsData((prev) => {
                const newPosts = response.data.data.filter(
                    (p) => !prev.some((old) => old.id === p.id)
                );
                return [...prev, ...newPosts];
            });
            setNextPageUrl(response.data.next_page_url);
        } catch (err) {
            console.error("lỗi: ", err);
        } finally {
            setLoading(false);
            
        }
    };

    useEffect(() => {
        getPostData("/posts");
    }, []);

    // 3. Sửa Logic Scroll Listener: Dùng Ref thay vì Window
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current; // Lấy element từ ref

        const handleScroll = () => {
            if (!scrollContainer) return;

            // Công thức tính cho Element khác với Window một chút:
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer;

            // scrollTop: Vị trí hiện tại đang cuộn
            // clientHeight: Chiều cao nhìn thấy được của khung
            // scrollHeight: Tổng chiều cao nội dung thực tế
            
            if (scrollTop + clientHeight >= scrollHeight - 50) { 
                if (nextPageUrl && !loading) {
                    getPostData(nextPageUrl);
                }
            }
        };

        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll);
        }

        // Cleanup function
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", handleScroll);
            }
        };
    }, [nextPageUrl, loading]); // Dependencies giữ nguyên

    return (
        
        <div 
            ref={scrollContainerRef} 
            className="h-[calc(100vh-64px)] overflow-y-auto w-full flex flex-col items-center gap-4 pb-10"
        >
            <div className="mt-6 w-full flex flex-col items-center gap-4">
                {postsData.map((post, index) => (
                    <div key={post.id} className="w-full max-w-xl">
                        <PostCard postData={post} index={index} />
                    </div>
                ))}

                {loading && <div className="py-4">Đang tải thêm...</div>}
            </div>
        </div>
    );
}