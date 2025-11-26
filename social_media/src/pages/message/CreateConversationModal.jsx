import React, { useState, useEffect, useContext } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Checkbox,
    ListItemAvatar,
    Avatar,
    Typography,
    Box,
    CircularProgress,
    Snackbar,
    Alert
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";
import AvatarUser from "../../shared/components/AvatarUser";

export default function CreateConversationModal({ onClose, onSuccess }) {
    const [conversationName, setConversationName] = useState("");
    const [friends, setFriends] = useState([]);
    const { userData } = useContext(AuthContext);
    const [selectedFriendIds, setSelectedFriendIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
    const currentUserId = userData.id;
    const queryClient = useQueryClient();
    useEffect(() => {
        const fetchFriends = async () => {
            setLoading(true);
            try {
                const response = await api.get(`friendship/${currentUserId}`);
                setFriends(response.data.friends);
            } catch (error) {
                console.error("Lỗi khi tải danh sách bạn bè:", error);
                setSnackbar({ open: true, message: "Lỗi khi tải danh sách bạn bè", severity: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchFriends();
    }, []);

    const handleToggleFriend = (id) => {
        const currentIndex = selectedFriendIds.indexOf(id);
        const newChecked = [...selectedFriendIds];
        if (currentIndex === -1) {
            newChecked.push(id);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setSelectedFriendIds(newChecked);
    };

    const handleCreate = async () => {
        if (!conversationName.trim()) {
            setSnackbar({ open: true, message: "Vui lòng nhập tên cuộc trò chuyện!", severity: "warning" });
            return;
        }
        if (selectedFriendIds.length === 0) {
            setSnackbar({ open: true, message: "Vui lòng chọn ít nhất một người bạn!", severity: "warning" });
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                name: conversationName,
                users: selectedFriendIds,
            };
            console.log(payload);
            await api.post("/conversations", payload);
            await queryClient.invalidateQueries({ queryKey: ["conversations"] });
            setSnackbar({ open: true, message: "Tạo cuộc trò chuyện thành công!", severity: "success" });

            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Lỗi khi tạo cuộc trò chuyện:", error);
            setSnackbar({ open: true, message: "Tạo thất bại, vui lòng thử lại.", severity: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return (
        <>
            <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Tạo cuộc trò chuyện mới</DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ mb: 3, mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Tên cuộc trò chuyện"
                            variant="outlined"
                            value={conversationName}
                            onChange={(e) => setConversationName(e.target.value)}
                            placeholder="Ví dụ: Nhóm học tập..."
                        />
                    </Box>

                    <Typography variant="subtitle1" gutterBottom>
                        Chọn thành viên:
                    </Typography>

                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <List sx={{ width: "100%", bgcolor: "background.paper", maxHeight: 300, overflow: 'auto' }}>
                            {friends.length > 0 ? (
                                friends.map((friend) => {
                                    const labelId = `checkbox-list-label-${friend.id}`;
                                    return (
                                        <ListItem key={friend.id} disablePadding>
                                            <ListItemButton role={undefined} onClick={() => handleToggleFriend(friend.id)} dense>
                                                <Checkbox
                                                    edge="start"
                                                    checked={selectedFriendIds.indexOf(friend.id) !== -1}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{ "aria-labelledby": labelId }}
                                                />
                                                <ListItemAvatar>
                                                    <AvatarUser userData={friend} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    id={labelId}
                                                    primary={friend.name}
                                                    secondary={friend.email ? friend.email : null}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })
                            ) : (
                                <Typography align="center" color="textSecondary">
                                    Không tìm thấy bạn bè nào.
                                </Typography>
                            )}
                        </List>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color="inherit" disabled={submitting}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleCreate}
                        variant="contained"
                        color="primary"
                        disabled={submitting || loading}
                    >
                        {submitting ? "Đang tạo..." : "Tạo nhóm"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
