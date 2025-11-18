// src/components/Post/PostCard.jsx
import { useContext, useEffect, useState } from 'react';
import PostHeader from './PostHeader';
import PostActionsBar from './PostActionsBar';
import { AuthContext } from '../../router/AuthProvider';

export default function PostCard({ postData }) {

    if (!postData) return null;

    const [headerData, setHeaderData] = useState(null);
    const {userData} = useContext(AuthContext);


    useEffect(() => {
        if (!postData.user) return;
        setHeaderData({
            author: postData.user.name,
            id:postData.user.id,
            timeAgo: "2 giờ trước", // tạm placeholder
            isOwner: userData.id === postData.user.id,
            avatarUrl: postData.user.avatarUrl
        })
    }, [postData]);

    return (
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm overflow-hidden">

            {/* Header */}
            <PostHeader headerData={headerData} postData={postData} />

            {/* Content */}
            <p className="text-base px-4 py-2">
                {postData.content}
            </p>

            {/* Media */}
            <div className="grid grid-cols-2 gap-1 px-2">
                {postData.media?.map((item, index) => (
                    <div
                        key={index}
                        className="aspect-square bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.media_url})` }}
                    />
                ))}
            </div>

            {/* Action Bar */}
            <PostActionsBar
                likes={postData.reactions_count}
                comments={postData.comments_count}
                isLiked={postData.is_liked}
                postId = {postData.id}
            />

        </div>
    );
}
