import { useState } from "react";
import AvatarUser from "../../shared/components/AvatarUser";
import { api } from "../../shared/api";

export default function FriendCard({
  friend,
  defaultStatus,
  isOwnProfile,
  onChange, // optional: parent muốn biết khi status đổi
}) {
  const {
  id,
  name,
  gender,
  avatarUrl,
  email,
  pivot = {},
} = friend;
  const{ status: friend_status=null, id: friendship_id=null, user_id: user_id=null }=pivot;
  console.log("isOwnProfile: ", isOwnProfile);
  const [friendStatus, setFriendStatus] = useState(
    friend_status || defaultStatus
  ); // none | friends | pending_sent | pending_received | self
  const [friendshipId, setFriendshipId] = useState(friendship_id || null);
  const [loading, setLoading] = useState(false);

  // --- GỬI LỜI MỜI KẾT BẠN ---
  const handleAddFriend = async () => {
    try {
      setLoading(true);
      const res = await api.post("/friendships", {
        addressee_id: id,
      });
      setFriendStatus("pending");
      setFriendshipId(res.data.id);
      onChange?.({ status: "pending", friendshipId: res.data.id });
    } catch (err) {
      console.error(err);
      alert("Gửi lời mời kết bạn thất bại");
    } finally {
      setLoading(false);
    }
  };

  // --- HỦY KẾT BẠN / HỦY LỜI MỜI ---
  const handleUnfriendOrCancel = async () => {
    if (!friendshipId) return;
    console.log(friend);
    try {
      setLoading(true);
      const response = await api.delete(`/friendship/${friendshipId}`);
      setFriendStatus("none");
      setFriendshipId(null);
      onChange?.({ status: "none", friendshipId: null });
    } catch (err) {
      console.error(err);
      alert("Thao tác thất bại");
    } finally {
      setLoading(false);
    }
  };

  // --- CHẤP NHẬN YÊU CẦU ---
  const handleAccept = async () => {
    if (!friendshipId) return;
    try {
      setLoading(true);
      await api.patch(`/friendships/${friendshipId}`, {
        status: "accepted",
      });
      setFriendStatus("accepted");
      onChange?.({ status: "accepted", friendshipId });
    } catch (err) {
      console.error(err);
      alert("Không thể chấp nhận lời mời");
    } finally {
      setLoading(false);
    }
  };

  // --- TỪ CHỐI YÊU CẦU ---
  const handleReject = async () => {
    if (!friendshipId) return;
    try {
      setLoading(true);
      await api.patch(`/api/friendships/${friendshipId}`, {
        status: "rejected",
      });
      setFriendStatus("none");
      setFriendshipId(null);
      onChange?.({ status: "none", friendshipId: null });
    } catch (err) {
      console.error(err);
      alert("Không thể từ chối lời mời");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER BUTTON THEO TRẠNG THÁI ---

  const renderActions = () => {
    if (friendStatus === "self") {
      return <span className="friend-badge">Đây là bạn</span>;
    }

    if (friendStatus === "accepted") {
      return (
        <button
          type="button"
          className="btn-unfriend"
          disabled={loading}
          onClick={handleUnfriendOrCancel}
        >
          Unfriend
        </button>
      );
    }

    if (friendStatus === "pending" && user_id!==id) {
      return (
        <>
          <button type="button" className="btn-pending" 
          onClick={handleUnfriendOrCancel}
          >
            Chờ phản hồi
          </button>
        </>
      );
    }

    if (friendStatus === "pending"&& user_id===id  ) {
      return (
        <>
          <button
            type="button"
            className="btn-accept"
            disabled={loading}
            onClick={handleAccept}
          >
            Chấp nhận
          </button>
          <button
            type="button"
            className="btn-reject"
            disabled={loading}
            onClick={handleUnfriendOrCancel}
          >
            Từ chối
          </button>
        </>
      );
    }

    // none
    return (
      <button
        type="button"
        className="btn-add-friend"
        disabled={loading}
        onClick={handleAddFriend}
      >
        Add friend
      </button>
    );
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
        {/* <p className="friend-gender">{ gender || "@username"}</p> */}
        <p className="friend-mutual">0 bạn chung</p>
      </div>

      {/* Actions */}
      {isOwnProfile && <div className="friend-actions">{renderActions()}</div> }
    </div>
  );
}
