// src/components/Post/PostCard.jsx
import { useContext, useEffect, useState, useRef } from 'react'; // Import thêm useRef
import PostHeader from './PostHeader';
import PostActionsBar from './PostActionsBar';
import { AuthContext } from '../../router/AuthProvider';
import ImageViewer from '../../shared/components/ImageViewer';

// ... (Giữ nguyên phần icon ChevronLeft, ChevronRight) ...
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
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // --- Xử lý vuốt (Swipe) ---
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleTouchStart = (e) => {
        touchStartX.current = e.targetTouches[0].clientX;
        // FIX 1: Reset touchEndX bằng touchStartX ngay khi bắt đầu chạm
        // Nếu người dùng chỉ chạm mà không vuốt, distance sẽ bằng 0
        touchEndX.current = e.targetTouches[0].clientX;
    };
    const handleTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!postData?.media) return;

        const distance = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50;

        // Nếu distance = 0 (do click mà không vuốt), logic dưới này sẽ không chạy
        if (distance > minSwipeDistance) {
            if (currentImageIndex < mediaList.length - 1) {
                setCurrentImageIndex(prev => prev + 1);
            }
        }

        if (distance < -minSwipeDistance) {
            if (currentImageIndex > 0) {
                setCurrentImageIndex(prev => prev - 1);
            }
        }
    };
    // ---------------------------

    if (!postData) return null;

    // ... (Giữ nguyên phần useState headerData, localPostData và useEffect) ...
    const [headerData, setHeaderData] = useState(null);
    const [localPostData, setLocalPostData] = useState({
        likes: 0, comments: 0, shares: 0, isLiked: false, isShared: false, ...postData
    });
    const mediaList = postData.media || [];

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
        setCurrentImageIndex(0);
    }, [postData, userData?.id]);

    // ... (Giữ nguyên các hàm handleLike, Comment, Share) ...
    const handleLikeUpdate = (isLikedNow) => {
        setLocalPostData(prev => ({ ...prev, isLiked: isLikedNow, likes: isLikedNow ? prev.likes + 1 : prev.likes - 1 }));
    };
    const handleCommentUpdate = () => setLocalPostData(prev => ({ ...prev, comments: prev.comments + 1 }));
    const handleShareUpdate = (isSharedNow) => {
        setLocalPostData(prev => ({ ...prev, isShared: isSharedNow, shares: isSharedNow ? prev.shares + 1 : prev.shares - 1 }));
    };

    const nextImage = (e) => {
        e.stopPropagation();
        if (currentImageIndex < mediaList.length - 1) setCurrentImageIndex(prev => prev + 1);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        if (currentImageIndex > 0) setCurrentImageIndex(prev => prev - 1);
    };

    return (
        <>
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm overflow-hidden mb-4">
                <PostHeader headerData={headerData} postData={postData} index={index} />

                <p className="text-base px-4 py-2 whitespace-pre-line">{postData.content}</p>

                {/* Media Slider */}
                {mediaList.length > 0 && (
                    <div
                        className="relative group touch-pan-y" // Thêm touch-pan-y để không chặn cuộn dọc trang
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div
                            className="w-full aspect-square bg-black flex items-center justify-center cursor-pointer overflow-hidden select-none"
                            onClick={() => setSelectedImage(mediaList[currentImageIndex].media_url)}
                        >
                            <img
                                src={mediaList[currentImageIndex].media_url}
                                alt={`Slide ${currentImageIndex}`}
                                className="w-full h-full object-cover transition-transform duration-300 pointer-events-none" // pointer-events-none để tránh conflict drag ảnh
                            />
                        </div>

                        {/* Nút Previous */}
                        {currentImageIndex > 0 && (
                            <button
                                onClick={prevImage}
                                // FIX 2: Ngăn sự kiện chạm lan ra cha (để cha không tính là đang vuốt)
                                onTouchStart={(e) => e.stopPropagation()}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
                            >
                                <ChevronLeft />
                            </button>
                        )}

                        {/* Nút Next */}
                        {currentImageIndex < mediaList.length - 1 && (
                            <button
                                onClick={nextImage}
                                // FIX 2: Ngăn sự kiện chạm lan ra cha
                                onTouchStart={(e) => e.stopPropagation()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
                            >
                                <ChevronRight />
                            </button>
                        )}

                        {/* Pagination Dots */}
                        {mediaList.length > 1 && (
                            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
                                {mediaList.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all shadow-sm ${idx === currentImageIndex
                                                ? 'bg-blue-500 scale-110'
                                                : 'bg-white/60'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Số lượng ảnh */}
                        {mediaList.length > 1 && (
                            <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
                                {currentImageIndex + 1}/{mediaList.length}
                            </div>
                        )}
                    </div>
                )}

                <PostActionsBar
                    // ... props ...
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