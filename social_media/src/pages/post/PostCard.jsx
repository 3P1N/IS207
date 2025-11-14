// src/components/Post/PostCard.jsx
import PostHeader from './PostHeader';
import PostActionsBar from './PostActionsBar';

export default function PostCard({ post }) {
    return (
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm overflow-hidden">
            
            {/* 1. Header (Author, Time, More) */}
            <PostHeader 
                author={post.author.name}
                timeAgo={post.timeAgo}
                isOwner={true}
                profileUrl={post.author.profilePicture}
            />

            {/* 2. Content (Text) */}
            <p className="text-text-light-primary dark:text-text-dark-primary text-base font-normal leading-relaxed pb-3 pt-1 px-4">
                {post.content}
            </p>

            {/* 3. Media (Images) */}
            <div className="flex w-full grow bg-card-light dark:bg-card-dark">
                <div className="w-full gap-1 overflow-hidden bg-card-light dark:bg-card-dark grid grid-cols-2">
                    {post.media.map((item, index) => (
                        <div
                            key={index}
                            className="w-full bg-center bg-no-repeat bg-cover aspect-square rounded-none"
                            data-alt={item.alt}
                            style={{ backgroundImage: `url(${item.url})` }}
                        />
                    ))}
                </div>
            </div>

            {/* 4. Action Bar (Stats & Buttons) */}
            <PostActionsBar 
                likes={post.stats.likes}
                comments={post.stats.comments}
                shares={post.stats.shares}
                isLiked={post.isLiked}
            />

        </div>
    );
}