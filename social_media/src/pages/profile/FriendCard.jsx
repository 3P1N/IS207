import { useState } from "react";
import AvatarUser from "../../shared/components/AvatarUser";
export default function FriendCard({ friend, defaultStatus = "friends" }) {
  const { name, gender, avatarUrl, email } = friend;

  // friends | pending | none
  const [friendStatus, setFriendStatus] = useState(defaultStatus);

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
        <AvatarUser userData={friend} />
        {friendStatus === "friends" && <span className="friend-status-dot" />}
      </div>

      {/* Info */}
      <div className="friend-info">
        <p className="friend-name">{name}</p>
        <p className="friend-username">{email || gender || "@username"}</p>
        <p className="friend-mutual">{name} bạn chung</p>
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
        <button type="button" className="btn-pending" disabled>
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
