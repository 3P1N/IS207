// src/components/Post/CommentsSection/CommentsSection.jsx
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';

export default function CommentsSection({ comments, currentUserProfile }) {
    return (
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-4 flex flex-col gap-4">
            
            {/* Khung nhập bình luận */}
            <CommentInput 
                currentUserProfile={currentUserProfile}
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