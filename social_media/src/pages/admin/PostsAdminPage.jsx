import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  Paper,
  CircularProgress,
} from "@mui/material";
// 1. Import React Query hooks
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AvatarUser from "../../shared/components/AvatarUser";
import { Link } from "react-router-dom";
import { api } from "../../shared/api";

export default function PostsAdminPage() {
  const queryClient = useQueryClient();
  // Vẫn giữ state này để quản lý loading riêng cho từng nút bấm (UX tốt hơn)
  const [loadingToggles, setLoadingToggles] = useState({});

  // --- 1. HÀM FETCH DATA ---
  const fetchPostsViolation = async () => {
    const response = await api.get("admin/posts/violation");
    // React Query cần hàm này return dữ liệu, không phải set state
    return response.data;
  };

  // --- 2. SỬ DỤNG USEQUERY ---
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["violation-posts"], // Key định danh riêng cho list bài viết vi phạm
    queryFn: fetchPostsViolation,
    staleTime: 300 * 1000, // Cache dữ liệu trong 5p
    refetchOnWindowFocus: false,
  });

  // --- 3. HÀM XỬ LÝ ẨN/HIỆN BÀI VIẾT ---
  const toggleVisibility = async (postId) => {
    // Bật loading cho nút bấm cụ thể
    setLoadingToggles((prev) => ({ ...prev, [postId]: true }));

    try {
      await api.patch(`/admin/posts/${postId}/is_visible`);

      // Thành công -> Báo cho React Query biết dữ liệu đã cũ
      // Nó sẽ tự động gọi lại API fetchPostsViolation để lấy list mới nhất
      await queryClient.invalidateQueries({ queryKey: ["violation-posts"] });

    } catch (err) {
      console.log("Lỗi khi chỉnh trạng thái bài viết: ", err);
    } finally {
      // Tắt loading nút bấm
      setLoadingToggles((prev) => ({ ...prev, [postId]: false }));
    }
  };

  // --- 4. SẮP XẾP (Logic giữ nguyên) ---
  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => b.reports_count - a.reports_count),
    [posts]
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Quản lý bài viết
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Theo dõi các bài viết bị báo cáo, thay đổi trạng thái hiển thị và xem chi tiết.
      </Typography>

      <Paper
        elevation={3}
        sx={{
          mt: 2,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box sx={{ overflowX: "auto", width: "100%" }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f0f2f5" }}>
                <TableCell>ID bài</TableCell>
                <TableCell>Người đăng</TableCell>
                <TableCell>Nội dung</TableCell>
                <TableCell>Số report</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>

            {/* Dùng biến isLoading của React Query */}
            {isLoading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress /> <br /> Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {sortedPosts.map((post) => {
                  const isHidden = !post.is_visible; // Lưu ý logic ở đây tùy thuộc vào API trả về (is_visible true là hiện, false là ẩn)
                  const isLoadingThis = !!loadingToggles[post.id];

                  return (
                    <TableRow key={post.id} hover>
                      {/* ID bài viết – clickable */}
                      <TableCell>
                        <Typography
                          component={Link}
                          to={`/post/${post.id}`}
                          sx={{
                            textDecoration: "none",
                            color: "primary.main",
                            fontWeight: 600,
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          #{post.id}
                        </Typography>
                      </TableCell>

                      {/* Avatar + tên – click avatar vào profile */}
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <AvatarUser userData={post.user} />
                          <Typography variant="body2">{post.user?.name}</Typography>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ maxWidth: 300 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {post.content}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={`${post.reports_count} report`}
                          color={post.reports_count >= 10 ? "error" : "warning"}
                          size="small"
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={!post.is_visible ? "Đã ẩn" : "Đang hiển thị"}
                          color={!post.is_visible ? "default" : "success"}
                          size="small"
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Button
                          variant="contained"
                          size="small"
                          color={!post.is_visible ? "success" : "error"} // Nếu đang ẩn thì nút màu xanh (để hiện), ngược lại màu đỏ
                          onClick={() => toggleVisibility(post.id)}
                          disabled={isLoadingThis}
                        >
                          {isLoadingThis ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            !post.is_visible ? "Hiện lại" : "Ẩn bài"
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            )}
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}