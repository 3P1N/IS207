import React, { useState, useEffect, useContext } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  List, ListItem, ListItemButton, ListItemAvatar, ListItemText, Checkbox,
  CircularProgress, Typography, Box, Snackbar, Alert
} from "@mui/material";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";
import AvatarUser from "../../shared/components/AvatarUser";
import { useQueryClient } from "@tanstack/react-query";

export default function AddMemberModal({ open, onClose, threadId, currentMemberIds }) {
  const [friends, setFriends] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { userData } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch danh sách bạn bè
  useEffect(() => {
    if (open && userData?.id) {
      setLoading(true);
      api.get(`friendship/${userData.id}`)
        .then((res) => {
          // Lọc ra những người CHƯA có trong nhóm
          const allFriends = res.data.friends || [];
          const availableFriends = allFriends.filter(f => !currentMemberIds.includes(f.id));
          setFriends(availableFriends);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [open, userData, currentMemberIds]);

  const handleToggle = (id) => {
    const currentIndex = selectedIds.indexOf(id);
    const newChecked = [...selectedIds];
    if (currentIndex === -1) newChecked.push(id);
    else newChecked.splice(currentIndex, 1);
    setSelectedIds(newChecked);
  };

  const handleSubmit = async () => {
    if (selectedIds.length === 0) return;
    setSubmitting(true);
    try {
      // Gọi API thêm thành viên (Bạn cần điều chỉnh URL API cho đúng với Backend của bạn)
      await api.post(`/conversations/${threadId}/participants`, {
        user_ids: selectedIds
      });

      // Quan trọng: Refresh lại data của cuộc trò chuyện bên ngoài
      await queryClient.invalidateQueries(["messages", threadId]);
      
      onClose();
      setSelectedIds([]);
    } catch (error) {
      console.error("Lỗi thêm thành viên:", error);
      setErrorMsg("Không thể thêm thành viên. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Thêm thành viên mới</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center"><CircularProgress /></Box>
        ) : friends.length === 0 ? (
            <Typography align="center">Tất cả bạn bè đã có trong nhóm.</Typography>
        ) : (
          <List>
            {friends.map((friend) => (
              <ListItem key={friend.id} disablePadding>
                <ListItemButton onClick={() => handleToggle(friend.id)} dense>
                  <Checkbox
                    edge="start"
                    checked={selectedIds.indexOf(friend.id) !== -1}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemAvatar>
                    <AvatarUser userData={friend} />
                  </ListItemAvatar>
                  <ListItemText primary={friend.name} secondary={friend.email} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
        {errorMsg && <Alert severity="error" sx={{ mt: 2 }}>{errorMsg}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting || selectedIds.length === 0}>
          {submitting ? "Đang thêm..." : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}