const MOCK_POSTS = [
  {
    id: 1,
    authorName: "User Name",
    username: "@username",
    avatar: "https://i.pravatar.cc/100?img=10",
    createdAt: "2 giờ trước",
    content:
      "Hôm nay thử nghiệm giao diện mới cho trang cá nhân. Mọi người thấy sao? ✨",
    tag: "Cập nhật trạng thái",
    likes: 24,
    comments: 5,
    shares: 2,
  },
  {
    id: 2,
    authorName: "User Name",
    username: "@username",
    avatar: "https://i.pravatar.cc/100?img=11",
    createdAt: "1 ngày trước",
    content:
      "Cuối tuần vừa rồi đi cà phê code đến khuya. Đang build social media app bằng React + Spring Boot 😎",
    tag: "Lập trình",
    likes: 48,
    comments: 12,
    shares: 7,
  },
  {
    id: 3,
    authorName: "User Name",
    username: "@username",
    avatar: "https://i.pravatar.cc/100?img=12",
    createdAt: "3 ngày trước",
    content:
      "Nhớ phải backup database thường xuyên, đừng để đến lúc mất rồi mới ngồi hối hận 🧨",
    tag: "Chia sẻ kinh nghiệm",
    likes: 73,
    comments: 21,
    shares: 9,
  },
];

export default function ProfilePost() {
  return (
    <div className="space-y-6">
      {/* Header + filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Bài viết</h2>
          <p className="text-sm text-gray-500">
            Danh sách bài đăng gần đây của người dùng
          </p>
        </div>

        <div className="inline-flex overflow-hidden rounded-full border border-gray-200 bg-gray-50 text-xs font-medium text-gray-600">
          <button className="px-4 py-1.5 bg-white text-gray-900">
            Tất cả
          </button>
          <button className="px-4 py-1.5 hover:bg-white/70">Ảnh</button>
          <button className="px-4 py-1.5 hover:bg-white/70">Video</button>
        </div>
      </div>

      {/* Danh sách bài viết */}
      <div className="space-y-4">
        {MOCK_POSTS.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

function PostCard({ post }) {
  const {
    authorName,
    username,
    avatar,
    createdAt,
    content,
    tag,
    likes,
    comments,
    shares,
  } = post;

  return (
    <article className="rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      {/* Header post: avatar + tên */}
      <header className="mb-3 flex items-start gap-3">
        <img
          src={avatar}
          alt={authorName}
          className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {authorName}
              </p>
              <p className="text-xs text-gray-500">
                {username} · {createdAt}
              </p>
            </div>
            {tag && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                {tag}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Nội dung bài viết */}
      <div className="mb-3 text-sm text-gray-800 whitespace-pre-line">
        {content}
      </div>

      {/* Stats */}
      <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
        <span>{likes} lượt thích</span>
        <span>
          {comments} bình luận · {shares} lượt chia sẻ
        </span>
      </div>

      <hr className="border-gray-200" />

      {/* Action buttons */}
      <div className="mt-1 flex items-center justify-between text-xs font-medium text-gray-500">
        <PostAction label="Thích" />
        <PostAction label="Bình luận" />
        <PostAction label="Chia sẻ" />
      </div>
    </article>
  );
}

function PostAction({ label }) {
  return (
    <button
      type="button"
      className="flex flex-1 items-center justify-center gap-1 rounded-xl py-2 hover:bg-gray-100 active:scale-[0.98] transition"
    >
      <span>{label}</span>
    </button>
  );
}
