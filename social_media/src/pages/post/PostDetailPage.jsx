
import { useContext, useEffect, useState } from "react";
import PostCard from "./PostCard.jsx";
import CommentsSection from "./comment_session/CommentsSection.jsx";
import { useParams } from "react-router-dom";
import { api } from "../../shared/api.js";
import { AuthContext } from "../../router/AuthProvider.jsx";


export default function PostDetailPage() {

    const [postData, setPostData] = useState();
    const [loading, setLoading] = useState(false);
    const { postId } = useParams();
    const { token } = useContext(AuthContext);
    useEffect(() => {
        if (postId) {
            console.log(postId);
            getPostData(postId);
        }
    }, [postId]);

    const getPostData = async (postId) => {
        setLoading(true);
        try {
            const response = await api.get(`/posts/${postId}`);
            setPostData(response.data);
            console.log(response.data);
        } catch (err) {
            console("lỗi load bài đăng ", err);
        }
        setLoading(false);
    }

    return (
        <div className="mt-6 flex flex-col gap-6">
            {loading ? (
                <div className="flex justify-center items-center h-[80vh]">
                    <span className="text-gray-500 text-lg">Đang tải bài viết...</span>
                </div>
            ) : postData ? (
                <>
                    <PostCard postData={postData} />
                    <CommentsSection postId={postId} />
                </>
            ) : (
                <div className="flex justify-center items-center h-[80vh]">
                    <span className="text-gray-500 text-lg">Bài viết không tồn tại.</span>
                </div>
            )}
        </div>
    );


}