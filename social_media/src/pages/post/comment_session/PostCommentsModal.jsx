import React, { useState, useContext, useRef, useMemo, useEffect } from "react";
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

// --- Icons Mũi tên ---
const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);
const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export default function PostCommentsModal({ open, onClose, postId, postData, onCommentSuccess }) {
  const queryClient = useQueryClient();
  const [inputContent, setInputContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const inputRef = useRef(null);
  const { userData } = useContext(AuthContext);

  // --- State cho Carousel ảnh ---
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const mediaList = postData?.media || [];

  // Reset index khi mở modal khác hoặc postData thay đổi
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [postId]);

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
    onMutate: async (newCommentPayload) => {
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });
      const previousComments = queryClient.getQueryData(["comments", postId]);

      const optimisticComment = {
        id: Date.now(),
        content: newCommentPayload.content,
        parent_comment_id: newCommentPayload.parent_comment_id,
        user: userData,
        created_at: new Date().toISOString(),
        isSending: true,
      };

      queryClient.setQueryData(["comments", postId], (oldData) => {
        const currentComments = Array.isArray(oldData) ? oldData : [];
        return [...currentComments, optimisticComment];
      });

      setInputContent("");
      setReplyTo(null);

      return { previousComments };
    },
    onError: (err, newComment, context) => {
      console.error("Lỗi gửi comment:", err);
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", postId], context.previousComments);
      }
      setInputContent(newComment.content);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      if (onCommentSuccess) {
        onCommentSuccess();
      }
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

  // --- Logic chuyển ảnh ---
  const nextImage = (e) => {
    e.stopPropagation();
    if (currentImageIndex < mediaList.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
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
        scroll="paper"
        PaperProps={{
          sx: { height: '100%', maxHeight: '90vh' }
        }}
      >
        {/* --- 1. HEADER (CỐ ĐỊNH) --- */}
        <DialogTitle sx={{ p: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography component="span" sx={{ flex: 1, textAlign: "center", fontWeight: "bold", fontSize: '1.25rem' }}>
            Bài viết của {headerData?.author}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <div className="border-b border-gray-200 dark:border-gray-700"></div>

        {/* --- 2. SCROLLABLE CONTENT (NỘI DUNG CUỘN CHUNG) --- */}
        <DialogContent dividers={false} sx={{ p: 0 }}>

          {/* A. Phần Post Content + Media */}
          <Box sx={{ p: 2 }}>
            {headerData && <PostHeader headerData={headerData} postData={postData} />}
            <Typography sx={{ px: 2, mt: 1, whiteSpace: 'pre-line' }}>{postData?.content}</Typography>

            {/* Media Slider (Instagram Style) */}
            {mediaList.length > 0 && (
              <Box sx={{ mt: 2, borderRadius: 2, overflow: 'hidden' }}>
                <div className="relative group">
                  {/* Ảnh hiển thị */}
                  <div
                    className="w-full aspect-square bg-black flex items-center justify-center cursor-pointer overflow-hidden"
                    onClick={() => setSelectedImage(mediaList[currentImageIndex].media_url)}
                  >
                    <img
                      src={mediaList[currentImageIndex].media_url}
                      alt={`Slide ${currentImageIndex}`}
                      className="w-full h-full object-cover transition-transform duration-300"
                    />
                  </div>

                  {/* Nút Previous */}
                  {currentImageIndex > 0 && (
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 z-10"
                    >
                      <ChevronLeft />
                    </button>
                  )}

                  {/* Nút Next */}
                  {currentImageIndex < mediaList.length - 1 && (
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 z-10"
                    >
                      <ChevronRight />
                    </button>
                  )}

                  {/* Pagination Dots */}
                  {mediaList.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                      {mediaList.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full transition-all shadow-sm ${idx === currentImageIndex
                              ? 'bg-blue-500 scale-110'
                              : 'bg-white/60 hover:bg-white/90'
                            }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Số lượng ảnh (Góc trên phải) */}
                  {mediaList.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-10">
                      {currentImageIndex + 1}/{mediaList.length}
                    </div>
                  )}
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
                    disabled={!inputContent.trim()}
                  >
                    <SendIcon />
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