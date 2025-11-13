// src/pages/post/FeedPostItem.jsx
import PostCard from "./PostCard.jsx";

// Giả định bài viết trên Feed là của người khác
const IS_FEED_POST_OWNER = false; 

// Hàm xử lý Report (khi người dùng bấm vào cờ báo cáo)
const handleReport = () => alert("Gửi báo cáo vi phạm bài viết này.");

// (Các Mock Data khác cần được import hoặc định nghĩa ở đây)
// *LƯU Ý: Bạn cần import mockPostData, mockComments, currentUserId từ PostDetailPage.jsx 
// hoặc định nghĩa lại chúng ở đây nếu đây là file độc lập.*

export default function FeedPostItem({ postData, commentsData, currentUserProfile }) {
    
    // Nếu bạn muốn test bài viết của mình trên Feed, bạn sẽ kiểm tra postData.authorId === currentUserId
    // Nhưng để test mặc định, chúng ta dùng biến cố định.
    
    return (
        <PostCard 
            post={postData} 
            isOwner={IS_FEED_POST_OWNER} // <-- Luôn là FALSE
            onEdit={() => {}} // Không cần Edit trên Feed Post của người khác
            onReport={handleReport}
            mockComments={commentsData} 
            currentUserProfile={currentUserProfile}
        />
    );
}