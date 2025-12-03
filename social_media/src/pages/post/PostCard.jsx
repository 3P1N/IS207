// src/components/Post/PostCard.jsx
import { useContext, useEffect, useState } from 'react';
import PostHeader from './PostHeader';
import PostActionsBar from './PostActionsBar';
import { AuthContext } from '../../router/AuthProvider';
import ImageViewer from '../../shared/components/ImageViewer';

// Icon mũi tên (Bạn có thể dùng Lucide-react hoặc FontAwesome, ở đây mình dùng SVG đơn giản)
const ChevronLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);
const ChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

export default function PostCard({ postData, index }) {
    const { userData } = useContext(AuthContext);
    const [selectedImage, setSelectedImage] = useState(null);
    
    // --- State mới cho Carousel ảnh ---
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    // ----------------------------------

    if (!postData) return null;

    const [headerData, setHeaderData] = useState(null);
    const [localPostData, setLocalPostData] = useState({
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isShared: false,
        ...postData
    });

    const mediaList = postData.media || []; // Lấy danh sách ảnh

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
            isOwner: userData?.id === postData.user.id,
            avatarUrl: postData.user.avatarUrl
        });
        
        // Reset index ảnh khi postData thay đổi (trường hợp tái sử dụng component)
        setCurrentImageIndex(0); 
    }, [postData, userData?.id]);

    const handleLikeUpdate = (isLikedNow) => {
        setLocalPostData(prev => ({
            ...prev,
            isLiked: isLikedNow,
            likes: isLikedNow ? prev.likes + 1 : prev.likes - 1
        }));
    };

    const handleCommentUpdate = () => {
        setLocalPostData(prev => ({ ...prev, comments: prev.comments + 1 }));
    };

    const handleShareUpdate = (isSharedNow) => {
        setLocalPostData(prev => ({
            ...prev,
            isShared: isSharedNow,
            shares: isSharedNow ? prev.shares + 1 : prev.shares - 1
        }));
    };

    // --- Hàm xử lý chuyển ảnh ---
    const nextImage = (e) => {
        e.stopPropagation(); // Ngăn click vào ảnh mở ImageViewer
        if (currentImageIndex < mediaList.length - 1) {
            setCurrentImageIndex(prev => prev + 1);
        }
    };

    const prevImage = (e) => {
        e.stopPropagation();
        if (currentImageIndex > 0) {
            setCurrentImageIndex(prev => prev - 1);
        }
    };
    // ----------------------------

    return (
        <>
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm overflow-hidden mb-4">
                
                {/* Header */}
                <PostHeader headerData={headerData} postData={postData} index={index} />

                {/* Content */}
                <p className="text-base px-4 py-2 whitespace-pre-line">
                    {postData.content}
                </p>

                {/* Media - Instagram Style Slider */}
                {mediaList.length > 0 && (
                    <div className="relative group">
                        {/* Ảnh hiển thị */}
                        <div 
                            className="w-full aspect-square bg-black flex items-center justify-center cursor-pointer overflow-hidden"
                            onClick={() => setSelectedImage(mediaList[currentImageIndex].media_url)}
                        >
                            <img 
                                src={mediaList[currentImageIndex].media_url} 
                                alt={`Slide ${currentImageIndex}`}
                                className="w-full h-full object-cover transition-transform duration-300"
                            />
                        </div>

                        {/* Nút Previous (chỉ hiện khi không phải ảnh đầu) */}
                        {currentImageIndex > 0 && (
                            <button 
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft />
                            </button>
                        )}

                        {/* Nút Next (chỉ hiện khi không phải ảnh cuối) */}
                        {currentImageIndex < mediaList.length - 1 && (
                            <button 
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight />
                            </button>
                        )}

                        {/* Pagination Dots (Dấu chấm tròn ở dưới) */}
                        {mediaList.length > 1 && (
                            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                                {mediaList.map((_, idx) => (
                                    <div 
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all shadow-sm ${
                                            idx === currentImageIndex 
                                                ? 'bg-blue-500 scale-110' 
                                                : 'bg-white/60 hover:bg-white/90'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                        
                        {/* Số lượng ảnh góc trên phải (Optional - giống Instagram cũ) */}
                        {mediaList.length > 1 && (
                            <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                                {currentImageIndex + 1}/{mediaList.length}
                            </div>
                        )}
                    </div>
                )}

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

            {/* Full Screen Image Viewer */}
            {selectedImage && (
                <ImageViewer
                    src={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </>
    );
}