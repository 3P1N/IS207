// src/components/Post/CommentsSection/CommentsSection.jsx
import { useContext, useEffect, useState } from 'react';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';
import { AuthContext } from '../../../router/AuthProvider';
import { api } from '../../../shared/api';
import { useParams } from 'react-router-dom';

// Mock dữ liệu user hiện tại
const currentUserProfile = {
    name: "Bạn",
    profilePicture: "https://i.pravatar.cc/100?img=12",
};

// Mock danh sách comment
const comments = [
    {
        author: {
            name: "Nguyễn Văn A",
            profilePicture: "https://i.pravatar.cc/100?img=1",
        },
        text: "Bài đăng này hay quá!",
        timeAgo: "2 giờ trước",
        replies: [
            {
                author: {
                    name: "Trần Thị B",
                    profilePicture: "https://i.pravatar.cc/100?img=2",
                },
                text: "Chuẩn luôn, mình cũng thấy vậy!",
                timeAgo: "1 giờ trước",
            },
            {
                author: {
                    name: "Lê Minh C",
                    profilePicture: "https://i.pravatar.cc/100?img=3",
                },
                text: "Hay thật sự luôn.",
                timeAgo: "58 phút trước",
            },
        ],
    },
    {
        author: {
            name: "Hoàng D",
            profilePicture: "https://i.pravatar.cc/100?img=4",
        },
        text: "Cảm ơn bạn đã chia sẻ!",
        timeAgo: "30 phút trước",
        replies: [], // Không có reply
    },
];


export default function CommentsSection( ) {
    // console.log("postId at comments: ", postID );
    const {postId} = useParams();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token, userData } = useContext(AuthContext);
    const getComments = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/posts/${postId}/comments`,
                {
                    headers:
                        { Authorization: `Bearer ${token}` }
                }
            );
            console.log(response.data);
            setComments(response.data);
        }catch(err){
            console.log("Lỗi khi load comment: ", err);
        }finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        getComments();
    },[postId]);
    if(loading){
        return <div> Loading comments... </div>
    }
    if(!comments.length) {
        return <div>No comments yet</div>
    }
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

            {/* Danh sách bình luận */}
            <div className="flex flex-col gap-4">
                {comments.map((comment, index) => (
                    <CommentItem key={index} comment={comment} />
                ))}
            </div>
        </div>
    );
}