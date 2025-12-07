import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  CircularProgress,
  Divider,
  Box,
  Alert
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import AvatarUser from "../../shared/components/AvatarUser"; // Đảm bảo đường dẫn đúng
import { api } from "../../shared/api";

// Hàm format ngày giờ đơn giản
const formatDate = (isoString) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

export default function ReportDetailModal({ postId, open, onClose }) {
  // Fetch danh sách report dựa trên postId
  const { data: reports = [], isLoading, isError } = useQuery({
    queryKey: ["post-reports", postId],
    queryFn: async () => {
      const response = await api.get(`admin/posts/${postId}/reports`);
      return response.data;
    },
    enabled: !!postId && open, // Chỉ fetch khi có postId và modal đang mở
    staleTime: 0, // Luôn fetch mới nhất khi mở modal
  });

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ pb: 1 }}>
        Chi tiết báo cáo (ID bài: {postId})
      </DialogTitle>
      
      <DialogContent dividers>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : isError ? (
           <Alert severity="error">Không thể tải danh sách báo cáo.</Alert>
        ) : reports.length === 0 ? (
          <Typography align="center" color="text.secondary" py={2}>
            Không có báo cáo nào cho bài viết này.
          </Typography>
        ) : (
          <List disablePadding>
            {reports.map((report, index) => (
              <React.Fragment key={report.id}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    {/* Truyền object reporter vào AvatarUser như logic cũ */}
                    <AvatarUser userData={report.reporter} size={40} />
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" component="span" fontWeight="bold">
                          {report.reporter?.name || "Unknown User"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(report.created_at)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ mt: 0.5, display: 'block' }}
                      >
                        <span style={{ fontWeight: 500, color: '#d32f2f' }}>Lý do: </span> 
                        {report.reason}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < reports.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}