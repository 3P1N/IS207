import { useContext, useEffect, useState } from "react";
import { api } from "../../shared/api";
import { AuthContext } from "../../router/AuthProvider";
import PostCard from "../post/PostCard";

export default function HomePage() {

    const [posts, setPosts] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const { token } = useContext(AuthContext);

    const getPostData = async (url = "/posts") => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await api.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response.data);

            // response.data = paginate object
            // response.data.data = array posts
            setPosts((prev) => {
                const newPosts = response.data.data.filter(
                    (p) => !prev.some((old) => old.id === p.id)
                );
                return [...prev, ...newPosts];
            });


            // update next_page_url
            setNextPageUrl(response.data.next_page_url);

        } catch (err) {
            console.log("lỗi khi tải bài viết: ", err);
        } finally {
            setLoading(false);
        }
    };

    // load trang đầu tiên
    useEffect(() => {
        getPostData();
    }, []); // 👈 thêm dependency rỗng để tránh gọi vô hạn


    // scroll listener để auto load
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 50 >=
                document.documentElement.scrollHeight
            ) {
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
            {posts.map((post) => (
                <div key={post.id} className="w-full max-w-xl">
                    <PostCard postData={post} />
                </div>
            ))}

            {loading && <div>Đang tải thêm...</div>}
        </div>
    );

}
