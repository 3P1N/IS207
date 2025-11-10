const MOCK_FRIENDS = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    username: "@nguyenvana",
    avatar: "https://i.pravatar.cc/100?img=1",
    isFriend: true,
    mutual: 12,
  },
  {
    id: 2,
    name: "Trần Thị B",
    username: "@tranb",
    avatar: "https://i.pravatar.cc/100?img=2",
    isFriend: false,
    mutual: 3,
  },
  {
    id: 3,
    name: "Lê Văn C",
    username: "@levanc",
    avatar: "https://i.pravatar.cc/100?img=3",
    isFriend: true,
    mutual: 5,
  },
];

export default function ProfileFriend() {
  return (
    <div className="space-y-6">
      {/* Header + search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Bạn bè</h2>
          <p className="text-sm text-gray-500">
            Danh sách bạn bè và lời mời kết bạn
          </p>
        </div>

        <div className="w-full max-w-xs">
          <input
            type="text"
            placeholder="Tìm bạn bè..."
            className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
        </div>
      </div>

      {/* Danh sách bạn bè */}
      <div className="grid gap-4 sm:grid-cols-2">
        {MOCK_FRIENDS.map((friend) => (
          <FriendCard key={friend.id} friend={friend} />
        ))}
      </div>
    </div>
  );
}

function FriendCard({ friend }) {
  const { name, username, avatar, isFriend, mutual } = friend;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
      {/* Avatar */}
      <div className="relative">
        <img
          src={avatar}
          alt={name}
          className="h-12 w-12 rounded-full object-cover"
        />
        {isFriend && (
          <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">{name}</p>
        <p className="text-xs text-gray-500">{username}</p>
        <p className="mt-1 text-xs text-gray-400">
          {mutual} bạn chung
        </p>
      </div>

      {/* Nút Add / Unfriend */}
      {isFriend ? (
        <button
          type="button"
          className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100 active:scale-95 transition"
        >
          Unfriend
        </button>
      ) : (
        <button
          type="button"
          className="rounded-full bg-sky-500 px-3 py-1 text-xs font-medium text-white shadow hover:bg-sky-600 active:scale-95 transition"
        >
          Add friend
        </button>
      )}
    </div>
  );
}
