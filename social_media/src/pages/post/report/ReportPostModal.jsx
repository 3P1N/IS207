import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
} from "@mui/material";

// Danh sách các lý do báo cáo định sẵn
const PREDEFINED_REASONS = [
  "Spam",
  "Nội dung không phù hợp",
  "Bạo lực",
  "Thông tin sai lệch",
  "Quấy rối",
];

export default function ReportPostModal({ open, onClose, onSubmit, loading }) {
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [otherReason, setOtherReason] = useState("");
  const [isOtherChecked, setIsOtherChecked] = useState(false);

  // Xử lý khi tick vào checkbox định sẵn
  const handleToggleReason = (reason) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  // Xử lý submit
  const handleSubmit = () => {
    let finalReasons = [...selectedReasons];

    // Nếu chọn Other và có nhập nội dung
    if (isOtherChecked && otherReason.trim() !== "") {
      finalReasons.push(`Khác: ${otherReason.trim()}`);
    }

    // Gom thành chuỗi cách nhau bởi dấu phẩy
    const reasonString = finalReasons.join(", ");
    
    // Gửi ngược lại cho parent
    onSubmit(reasonString);
  };

  // Reset form khi đóng nếu cần (hoặc để React tự unmount)
  const handleClose = () => {
    setSelectedReasons([]);
    setOtherReason("");
    setIsOtherChecked(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Báo cáo bài viết</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" gutterBottom color="textSecondary">
          Hãy chọn lý do bạn muốn báo cáo bài viết này:
        </Typography>
        
        <FormGroup>
          {PREDEFINED_REASONS.map((reason) => (
            <FormControlLabel
              key={reason}
              control={
                <Checkbox
                  checked={selectedReasons.includes(reason)}
                  onChange={() => handleToggleReason(reason)}
                />
              }
              label={reason}
            />
          ))}

          {/* Tùy chọn Other */}
          <FormControlLabel
            control={
              <Checkbox
                checked={isOtherChecked}
                onChange={(e) => setIsOtherChecked(e.target.checked)}
              />
            }
            label="Lý do khác"
          />
        </FormGroup>

        {/* Ô nhập text cho Other (chỉ hiện khi checkbox Other được tick) */}
        {isOtherChecked && (
          <TextField
            autoFocus
            margin="dense"
            label="Nhập lý do cụ thể"
            type="text"
            fullWidth
            variant="outlined"
            size="small"
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            multiline
            rows={2}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading} color="inherit">
          Hủy
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="error" 
          disabled={loading || (selectedReasons.length === 0 && !isOtherChecked)}
        >
          {loading ? "Đang gửi..." : "Gửi báo cáo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}