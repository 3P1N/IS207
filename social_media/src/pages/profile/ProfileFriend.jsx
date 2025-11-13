import './profile.css'
import { useState } from "react";
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
      <div className="friends-header">
        <div>
          <h2 className="friends-title">Bạn bè</h2>
          <p className="friends-subtitle">
            Danh sách bạn bè và lời mời kết bạn
          </p>
        </div>

        <div className="friends-search-wrapper">
          <input
            type="text"
            placeholder="Tìm bạn bè..."
            className="friends-search-input"
          />
        </div>
      </div>

      {/* Danh sách bạn bè */}
      <div className="friends-grid">
        {MOCK_FRIENDS.map((friend) => (
          <FriendCard key={friend.id} friend={friend} />
        ))}
      </div>
    </div>
  );
}

function FriendCard({ friend }) {
  const { name, username, avatar, isFriend, mutual } = friend;

  // friends | pending | none
  const [friendStatus, setFriendStatus] = useState(
    isFriend ? "friends" : "none"
  );

  const handleAddFriend = () => {
    // TODO: gọi API gửi lời mời kết bạn
    setFriendStatus("pending");
  };

  const handleUnfriend = () => {
    // TODO: gọi API hủy kết bạn
    setFriendStatus("none");
  };

  return (
    <div className="friend-card">
      {/* Avatar */}
      <div className="friend-avatar-wrapper">
        <img
          src={avatar}
          alt={name}
          className="friend-avatar"
        />
        {/* chấm xanh chỉ hiện khi đã là bạn bè */}
        {friendStatus === "friends" && (
          <span className="friend-status-dot" />
        )}
      </div>

      {/* Info */}
      <div className="friend-info">
        <p className="friend-name">{name}</p>
        <p className="friend-username">{username}</p>
        <p className="friend-mutual">
          {mutual} bạn chung
        </p>
      </div>

      {/* Nút Add / Pending / Unfriend */}
      {friendStatus === "friends" && (
        <button
          type="button"
          className="btn-unfriend"
          onClick={handleUnfriend}
        >
          Unfriend
        </button>
      )}

      {friendStatus === "pending" && (
        <button
          type="button"
          className="btn-pending"
          disabled
        >
          Chờ phản hồi
        </button>
      )}

      {friendStatus === "none" && (
        <button
          type="button"
          className="btn-add-friend"
          onClick={handleAddFriend}
        >
          Add friend
        </button>
      )}
    </div>
  );
}

