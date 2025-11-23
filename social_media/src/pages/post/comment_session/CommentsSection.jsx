// src/components/Post/CommentsSection/CommentsSection.jsx
import { useContext, useEffect, useState } from 'react';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';
import { AuthContext } from '../../../router/AuthProvider';
import { api } from '../../../shared/api';
import { useParams } from 'react-router-dom';



export default function CommentsSection() {
    // console.log("postId at comments: ", postID );
    const { postId } = useParams();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token, userData } = useContext(AuthContext);
    const getComments = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/posts/${postId}/comments`);
            console.log(response.data);
            setComments(response.data);
        } catch (err) {
            console.log("Lỗi khi load comment: ", err);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getComments();
    }, [postId]);
    
    return (
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-4 flex flex-col gap-4">

            {/* Khung nhập bình luận */}
            <CommentInput
                currentUserProfile={userData}
                comments={comments}
                setComments={setComments}
                postId={postId}
            />
            <hr className="border-border-light dark:border-border-dark" />

            {loading ? (
                <div> Loading comments... </div>
            ) : (
                !comments.length ? (<div>No comments yet</div>) : (

                    <div className="flex flex-col gap-4">
                        {comments.map((comment, index) => (
                            <CommentItem key={index} comment={comment}
                                setComments={setComments}
                                comments = {comments}
                            />
                        ))}
                    </div>
                )

            )}



        </div>
    );
}