import ThreadList from "./ThreadList";
import { Outlet, useLocation, useParams } from "react-router-dom"; // Import thêm useParams
import { Box, Button, IconButton, useTheme, useMediaQuery } from "@mui/material";
import DefaultMessagePage from "./DefaultMessagePage";
import CreateConversationModal from "./CreateConversationModal";
import { useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import icon quay lại (nếu cần)

export default function MessageLayout() {
  const [isCreateConversation, setIsCreateConversation] = useState(false);
  
  // Lấy params từ URL để biết có đang vào thread cụ thể không
  // Ví dụ path: /message/:threadId
  const { threadId } = useParams(); 
  const isThreadSelected = !!threadId; // True nếu đang xem tin nhắn, False nếu ở trang chủ message

  // Responsive logic
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Kiểm tra màn hình nhỏ

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "91vh",
          bgcolor: "#f9f9f9",
          position: "relative", // Để xử lý absolute nếu cần
          overflow: "hidden"
        }}
      >
        {/* --- CỘT TRÁI (ThreadList) --- */}
        <Box
          sx={{
            width: { xs: "100%", md: 320 }, // Mobile: 100%, Desktop: 320px
            borderRight: "1px solid #ddd",
            overflowY: "auto",
            height: "100%",
            bgcolor: "white",
            // LOGIC ẨN HIỆN:
            // - Trên Desktop (md trở lên): Luôn hiện (block)
            // - Trên Mobile (xs): 
            //    + Nếu chưa chọn thread (!isThreadSelected) -> Hiện (block)
            //    + Nếu đã chọn thread (isThreadSelected) -> Ẩn (none)
            display: { 
                xs: !isThreadSelected ? "block" : "none", 
                md: "block" 
            },
          }}
        >
          <Box sx={{ p: 1, borderBottom: "1px solid #eee" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                setIsCreateConversation(true);
              }}
            >
              Thêm cuộc trò chuyện mới
            </Button>
          </Box>
          <ThreadList />
        </Box>

        {/* --- CỘT PHẢI (Nội dung tin nhắn - Outlet) --- */}
        <Box
          sx={{
            flex: 1,
            // LOGIC ẨN HIỆN:
            // - Trên Desktop: Luôn hiện
            // - Trên Mobile:
            //    + Nếu đã chọn thread -> Hiện
            //    + Nếu chưa chọn thread -> Ẩn (để nhường chỗ cho list)
            display: { 
                xs: isThreadSelected ? "flex" : "none", 
                md: "flex" 
            },
            flexDirection: "column",
            justifyContent: "center", // Canh giữa nếu là DefaultPage
            alignItems: "stretch",    // Để nội dung chat stretch full width
            bgcolor: "#f5f6fa",
            height: "100%",           // Quan trọng
            position: "relative"
          }}
        >
          {/* Outlet sẽ render ThreadPage hoặc rỗng */}
          {/* Nếu trên Desktop mà chưa chọn thread, hiển thị trang mặc định */}
          {isThreadSelected ? <Outlet /> : (
             <Box sx={{ display: { xs: 'none', md: 'flex' }, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                 <DefaultMessagePage />
             </Box>
          )}
        </Box>
      </Box>

      {isCreateConversation && (
        <CreateConversationModal
          onClose={() => setIsCreateConversation(false)}
        />
      )}
    </>
  );
}