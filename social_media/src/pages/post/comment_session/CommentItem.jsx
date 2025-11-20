// src/components/Post/CommentsSection/CommentItem.jsx
import CommentInput from './CommentInput'; // Sử dụng CommentInput cho phần Reply



export default function CommentItem({ comment }) {
    // Giả định comment.replies là mảng các reply
    // const hasReplies = comment.replies && comment.replies.length > 0;

    return (
        <div className="flex items-start gap-3">
            <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                data-alt={`${comment.user.name}'s profile picture`}
                style={{ backgroundImage: `url(${comment.user.profilePicture})` }}
            />
            <div className="flex-1 flex flex-col items-start">
                <div className="bg-background-light dark:bg-background-dark rounded-xl px-3 py-2">
                    <p className="font-semibold text-sm">{comment.user.name}</p>
                    <p className="text-sm">{comment.content}</p>
                </div>
                <div className="flex gap-3 text-xs font-semibold text-text-light-secondary dark:text-text-dark-secondary px-3 py-1">
                    <button className="hover:underline">Like</button>
                    <button className="hover:underline">Reply</button>
                    {/* <span>· {comment.timeAgo}</span> */}
                </div>
                
                {/* HIỂN THỊ PHẢN HỒI (REPLIES) */}
                {/* {hasReplies && (
                    <div className="flex flex-col gap-2 mt-2 w-full">
                        {comment.replies.map((reply, index) => (
                            <ReplyItem key={index} reply={reply} />
                        ))}
                    </div>
                )} */}
            </div>
        </div>
    );
}

// Component phụ cho Reply (đơn giản hóa)
function ReplyItem({ reply }) {
    return (
        <div className="flex items-start gap-3">
            <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8"
                data-alt={`${reply.author.name}'s profile picture`}
                style={{ backgroundImage: `url(${reply.author.profilePicture})` }}
            />
            <div className="flex-1 flex flex-col items-start">
                <div className="bg-background-light dark:bg-background-dark rounded-xl px-3 py-2">
                    <p className="font-semibold text-sm">{reply.author.name}</p>
                    <p className="text-sm">{reply.text}</p>
                </div>
                <div className="flex gap-3 text-xs font-semibold text-text-light-secondary dark:text-text-dark-secondary px-3 py-1">
                    <button className="hover:underline">Like</button>
                    <button className="hover:underline">Reply</button>
                    <span>· {reply.timeAgo}</span>
                </div>
            </div>
        </div>
    );
}