// src/components/Post/CommentsSection/CommentInput.jsx

export default function CommentInput({ currentUserProfile, placeholder = "Write a comment..." }) {
    return (
        <div className="flex items-start gap-3">
            <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 mt-1"
                data-alt="Current user's profile picture"
                style={{ backgroundImage: `url(${currentUserProfile})` }}
            />
            <div className="flex-1">
                <div className="bg-background-light dark:bg-background-dark rounded-xl p-3">
                    <textarea
                        className="form-textarea w-full resize-none border-none bg-transparent focus:ring-0 p-0 text-sm text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary"
                        placeholder={placeholder}
                        rows={2}
                    />
                </div>
                <div className="flex justify-end mt-2">
                    <button className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90">
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}