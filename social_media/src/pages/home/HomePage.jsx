import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { api } from "../../shared/api";
import { AuthContext } from "../../router/AuthProvider";
import PostCard from "../post/PostCard";

// Component Spinner nhỏ gọn (tái sử dụng nội bộ)
const LoadingSpinner = () => (
    <svg
        className="animate-spin h-8 w-8 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        ></circle>
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
    </svg>
);

export default function HomePage() {
    const { postsData, setPostsData } = useContext(AuthContext);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    // Ref tham chiếu đến container cuộn
    const scrollContainerRef = useRef(null);

    // Ref để lưu trạng thái loading hiện tại (giúp tránh closure cũ trong event listener)
    const loadingRef = useRef(false);
    loadingRef.current = loading;

    // Sử dụng useCallback để hàm không bị tạo lại mỗi lần render
    const getPostData = useCallback(async (urlString = "") => {
        if (loadingRef.current) return;
        if (urlString === null) return;

        setLoading(true);
        try {
            let url = "/posts"; // Endpoint gốc của chúng ta

            if (urlString && urlString.includes("http")) {
                const urlObj = new URL(urlString);
                // SỬA Ở ĐÂY: Thay vì lấy pathname, ta chỉ lấy phần tham số (?cursor=...)
                // Và nối nó vào endpoint gốc "/posts"
                url = "/posts" + urlObj.search;
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
            console.error("Lỗi tải bài viết: ", err);
        } finally {
            setLoading(false);
        }
    }, [setPostsData]);

    // 1. Gọi API lần đầu tiên khi mount
    useEffect(() => {
        if (postsData.length === 0) {
            getPostData("/posts");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2. Xử lý sự kiện Scroll
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer;

            // Kiểm tra nếu cuộn gần đến đáy (còn cách 50px)
            if (scrollTop + clientHeight >= scrollHeight - 50) {
                // Kiểm tra điều kiện: Có URL tiếp theo VÀ Không đang tải
                if (nextPageUrl && !loadingRef.current) {
                    getPostData(nextPageUrl);
                }
            }
        };

        scrollContainer.addEventListener("scroll", handleScroll);

        // Cleanup
        return () => {
            scrollContainer.removeEventListener("scroll", handleScroll);
        };
    }, [nextPageUrl, getPostData]); // dependency quan trọng: nextPageUrl

    return (
        <div
            ref={scrollContainerRef}
            className="h-[calc(100vh-64px)] overflow-y-auto w-full flex flex-col items-center gap-4 pb-10 scroll-smooth"
        >
            <div className="mt-6 w-full flex flex-col items-center gap-4">
                {postsData.map((post, index) => (
                    <div key={post.id} className="w-full max-w-xl">
                        <PostCard postData={post} index={index} />
                    </div>
                ))}

                {/* Phần hiển thị Loading Spinner */}
                {loading && (
                    <div className="py-6 w-full flex justify-center items-center">
                        <LoadingSpinner />
                    </div>
                )}

                {/* (Tùy chọn) Hiển thị khi hết dữ liệu */}
                {!loading && nextPageUrl === null && postsData.length > 0 && (
                    <div className="py-4 text-gray-500 text-sm">
                        Đã hiển thị tất cả bài viết
                    </div>
                )}
            </div>
        </div>
    );
}