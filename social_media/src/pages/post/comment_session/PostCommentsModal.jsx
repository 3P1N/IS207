// src/components/Post/comment/PostCommentsModal.jsx
import React, { useState, useContext, useRef, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Box,
  CircularProgress,
  InputAdornment,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../shared/api";
import PostHeader from "../PostHeader";
import CommentItem from "./CommentItem";
import ImageViewer from "../../../shared/components/ImageViewer";
import { AuthContext } from "../../../router/AuthProvider";

export default function PostCommentsModal({ open, onClose, postId, postData }) {
  const queryClient = useQueryClient();
  const [inputContent, setInputContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const inputRef = useRef(null);
  const { userData } = useContext(AuthContext);

  // --- FETCH COMMENTS ---
  const { data: allComments = [], isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await api.get(`/posts/${postId}/comments`);
      return res.data;
    },
    enabled: !!postId && open,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const rootComments = useMemo(() => {
    return Array.isArray(allComments)
      ? allComments.filter((c) => c.parent_comment_id === null)
      : [];
  }, [allComments]);

  // --- GỬI COMMENT ---
  const sendCommentMutation = useMutation({
    mutationFn: async (payload) => {
      return await api.post(`/posts/${postId}/comments`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
      setInputContent("");
      setReplyTo(null);
    },
    onError: (err) => {
      console.error("Lỗi gửi comment:", err);
    },
  });

  const handleSendComment = () => {
    if (!inputContent.trim()) return;
    const payload = {
      content: inputContent,
      parent_comment_id: replyTo ? replyTo.id : null,
    };
    sendCommentMutation.mutate(payload);
  };

  const handleSetComments = (updaterOrValue) => {
    queryClient.setQueryData(["comments", postId], (oldData) => {
      if (typeof updaterOrValue === "function") {
        return updaterOrValue(oldData || []);
      }
      return updaterOrValue;
    });
  };

  const handleReply = (commentTarget) => {
    setReplyTo(commentTarget);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const headerData = postData?.user
    ? {
        author: postData.user.name,
        id: postData.user.id,
        timeAgo: "Vừa xong",
        isOwner: userData?.id === postData.user.id,
        avatarUrl: postData.user.avatarUrl,
      }
    : null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        scroll="paper" // Cho phép cuộn nội dung trong Paper
        // Thiết lập chiều cao cố định (ví dụ 80-90% màn hình) để thanh cuộn hoạt động tốt
        PaperProps={{
            sx: { height: '100%', maxHeight: '90vh' } 
        }}
      >
        {/* --- 1. HEADER (CỐ ĐỊNH) --- */}
        <DialogTitle sx={{ p: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ flex: 1, textAlign: "center", fontWeight: "bold" }}>
            Bài viết của {headerData?.author}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <div className="border-b border-gray-200 dark:border-gray-700"></div>

        {/* --- 2. SCROLLABLE CONTENT (NỘI DUNG CUỘN CHUNG) --- */}
        {/* DialogContent tự động có overflow-y: auto. Ta bỏ display flex column đi để nó flow tự nhiên */}
        <DialogContent dividers={false} sx={{ p: 0 }}>
          
          {/* A. Phần Post Content + Media */}
          <Box sx={{ p: 2 }}>
            {headerData && <PostHeader headerData={headerData} postData={postData} />}
            <Typography sx={{ px: 2, mt: 1 }}>{postData?.content}</Typography>

            {/* Media Grid */}
            {postData?.media && postData.media.length > 0 && (
              <Box sx={{ mt: 2, borderRadius: 2, overflow: 'hidden' }}>
                 <div className={`grid gap-1 ${postData.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {postData.media.map((item, index) => (
                       <div 
                          key={index} 
                          className={`
                             relative overflow-hidden cursor-pointer bg-gray-100 group
                             ${postData.media.length === 1 ? 'aspect-video' : 'aspect-square'} 
                          `}
                          onClick={() => setSelectedImage(item.media_url)}
                       >
                          <img 
                            src={item.media_url} 
                            alt={`media-${index}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                       </div>
                    ))}
                 </div>
              </Box>
            )}
          </Box>

          <div className="border-b border-gray-100 dark:border-gray-800 w-full mb-2"></div>

          {/* B. Phần Danh Sách Comment */}
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", opacity: 0.8 }}>
               Bình luận
            </Typography>
          </Box>

          <Box sx={{ px: 2, pb: 2 }}>
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress size={30} />
              </Box>
            ) : rootComments.length === 0 ? (
              <Typography variant="body2" align="center" color="textSecondary" sx={{ mt: 4 }}>
                Chưa có bình luận nào. Hãy là người đầu tiên!
              </Typography>
            ) : (
              rootComments.map((cmt) => (
                <CommentItem
                  key={cmt.id}
                  comment={cmt}
                  onReply={handleReply}
                  postId={postId}
                  setComments={handleSetComments}
                />
              ))
            )}
          </Box>
        </DialogContent>

        {/* --- 3. FOOTER INPUT (CỐ ĐỊNH Ở ĐÁY) --- */}
        {/* Đặt Box này ra ngoài DialogContent để nó luôn hiển thị ở dưới cùng mà không bị cuộn theo nội dung */}
        <Box sx={{ p: 2, borderTop: "1px solid #eee", bgcolor: "background.paper", zIndex: 10 }}>
            {replyTo && (
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, bgcolor: "#f5f5f5", p: 1, borderRadius: 1 }}>
                <Typography variant="caption">
                  Đang phản hồi <b>{replyTo.user?.name}</b>...
                </Typography>
                <CloseIcon
                  fontSize="small"
                  sx={{ cursor: "pointer" }}
                  onClick={() => setReplyTo(null)}
                />
              </Box>
            )}

            <TextField
              fullWidth
              inputRef={inputRef}
              placeholder="Viết bình luận..."
              variant="outlined"
              size="small"
              multiline
              maxRows={4}
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendComment();
                }
              }}
              InputProps={{
                sx: { borderRadius: 5 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleSendComment}
                      color="primary"
                      disabled={!inputContent.trim() || sendCommentMutation.isPending}
                    >
                      {sendCommentMutation.isPending ? <CircularProgress size={20} /> : <SendIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
        </Box>

      </Dialog>

      {/* ImageViewer */}
      {selectedImage && (
        <ImageViewer
          src={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}