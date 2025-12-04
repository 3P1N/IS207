import { useState } from "react";
import { Box, Stack, Typography, Button, Chip } from "@mui/material";
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
      return <Chip label="Đây là bạn" size="small" color="default" />;
    }

    if (friendStatus === "accepted") {
      return (
        <Button
          variant="outlined"
          size="small"
          disabled={loading}
          onClick={handleUnfriendOrCancel}
          sx={{ minWidth: 100 }}
        >
          Unfriend
        </Button>
      );
    }

    if (friendStatus === "pending" && user_id!==id) {
      return (
        <Button
          variant="outlined"
          size="small"
          disabled={loading}
          onClick={handleUnfriendOrCancel}
          sx={{ minWidth: 100 }}
        >
          Chờ phản hồi
        </Button>
      );
    }

    if (friendStatus === "pending"&& user_id===id) {
      return (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            size="small"
            disabled={loading}
            onClick={handleAccept}
            sx={{ minWidth: 80 }}
          >
            Chấp nhận
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            disabled={loading}
            onClick={handleUnfriendOrCancel}
            sx={{ minWidth: 80 }}
          >
            Từ chối
          </Button>
        </Stack>
      );
    }

    // none
    return (
      <Button
        variant="contained"
        size="small"
        disabled={loading}
        onClick={handleAddFriend}
        sx={{ minWidth: 100 }}
      >
        Add friend
      </Button>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        minHeight: 80,
        width: '100%'
      }}
    >
      {/* Avatar */}
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        <AvatarUser userData={friend} />
        {friendStatus === "friends" && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 12,
              height: 12,
              bgcolor: 'success.main',
              borderRadius: '50%',
              border: '2px solid white'
            }}
          />
        )}
      </Box>

      {/* Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography 
          variant="subtitle2" 
          fontWeight={600}
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          0 bạn chung
        </Typography>
      </Box>

      {/* Actions */}
      {isOwnProfile && (
        <Box sx={{ flexShrink: 0 }}>
          {renderActions()}
        </Box>
      )}
    </Box>
  );
}
