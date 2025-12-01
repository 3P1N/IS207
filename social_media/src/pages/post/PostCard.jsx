// src/components/Post/PostCard.jsx
import { useContext, useEffect, useState } from 'react';
import PostHeader from './PostHeader';
import PostActionsBar from './PostActionsBar';
import { AuthContext } from '../../router/AuthProvider';
import ImageViewer from '../../shared/components/ImageViewer';

export default function PostCard({ postData, index }) {

    const { postsData, setPostsData } = useContext(AuthContext);
    const [selectedImage, setSelectedImage] = useState(null);
    
    if (!postData) return null;

    const [headerData, setHeaderData] = useState(null);
    const { userData } = useContext(AuthContext);

    const [localPostData, setLocalPostData] = useState({
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isShared: false,
        ...postData // fallback
    });

    useEffect(() => {
        if (!postData) return;
        setLocalPostData({
            likes: postData.reactions_count,
            comments: postData.comments_count,
            shares: postData.shares_count,
            isLiked: postData.is_liked,
            isShared: postData.is_shared,
        });

        if (!postData.user) return;
        setHeaderData({
            author: postData.user.name,
            id: postData.user.id,
            created_at: postData.created_at,
            isOwner: userData.id === postData.user.id,
            avatarUrl: postData.user.avatarUrl
        });
    }, [postData, userData.id]);

    const handleLikeUpdate = (isLikedNow) => {
        setLocalPostData(prev => ({
            ...prev,
            isLiked: isLikedNow,
            likes: isLikedNow ? prev.likes + 1 : prev.likes - 1
        }));
    };

    // Tăng số comment
    const handleCommentUpdate = () => {
        setLocalPostData(prev => ({
            ...prev,
            comments: prev.comments + 1
        }));
    };

    // Tăng số share và đổi trạng thái
    const handleShareUpdate = (isSharedNow) => {
        setLocalPostData(prev => ({
            ...prev,
            isShared: isSharedNow,
            shares: isSharedNow ? prev.shares + 1 : prev.shares - 1 // Hoặc chỉ cộng nếu không cho unshare
        }));
    };

    return (
        <>
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm overflow-hidden">

                {/* Header */}
                <PostHeader headerData={headerData} postData={postData} index={index} />

                {/* Content */}
                <p className="text-base px-4 py-2">
                    {postData.content}
                </p>

                {/* Media */}
                <div className="grid grid-cols-2 gap-1 px-2">
                    {postData.media?.map((item, index) => (
                        <div
                            key={index}
                            className="aspect-square bg-cover bg-center cursor-pointer hover:opacity-90 transition-opacity"
                            style={{ backgroundImage: `url(${item.media_url})` }}
                            onClick={() => setSelectedImage(item.media_url)}
                        />
                    ))}
                </div>

                {/* Action Bar */}
                <PostActionsBar
                    likes={localPostData.likes}
                    comments={localPostData.comments}
                    shares={localPostData.shares}
                    isLiked={localPostData.isLiked}
                    isShared={localPostData.isShared}
                    postId={postData.id}
                    onLikeUpdate={handleLikeUpdate}   
                    onShareUpdate={handleShareUpdate}
                    onCommentUpdate={handleCommentUpdate} 
                    postData={postData}
                />
            </div>
            {selectedImage && (
                <ImageViewer
                    src={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </>
    );
}
