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
  TextField,
  InputAdornment,
} from "@mui/material";
// 1. Import React Query hooks
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SearchIcon from "@mui/icons-material/Search"; // Import icon tìm kiếm
import AvatarUser from "../../shared/components/AvatarUser";
import { Link } from "react-router-dom";
import { api } from "../../shared/api";

export default function PostsAdminPage() {
  const queryClient = useQueryClient();
  const [loadingToggles, setLoadingToggles] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // <--- 1. State tìm kiếm

  // --- 1. HÀM FETCH DATA ---
  const fetchPostsViolation = async () => {
    const response = await api.get("admin/posts/violation");
    return response.data;
  };

  // --- 2. SỬ DỤNG USEQUERY ---
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["violation-posts"],
    queryFn: fetchPostsViolation,
    staleTime: 300 * 1000,
    refetchOnWindowFocus: false,
  });

  // --- 3. HÀM XỬ LÝ ẨN/HIỆN BÀI VIẾT ---
  const toggleVisibility = async (postId) => {
    setLoadingToggles((prev) => ({ ...prev, [postId]: true }));
    try {
      await api.patch(`/admin/posts/${postId}/is_visible`);
      await queryClient.invalidateQueries({ queryKey: ["violation-posts"] });
    } catch (err) {
      console.error("Lỗi khi chỉnh trạng thái bài viết: ", err);
    } finally {
      setLoadingToggles((prev) => ({ ...prev, [postId]: false }));
    }
  };

  // --- 4. LỌC & SẮP XẾP ---
  const processedPosts = useMemo(() => {
    let result = [...posts];

    // BƯỚC LỌC (FILTER)
    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter((post) => {
        // Lọc theo ID (chuyển sang string để so sánh)
        const idMatch = String(post.id).includes(lowerTerm);
        // Lọc theo tên người đăng (lưu ý check null/undefined)
        const nameMatch = (post.user?.name || "").toLowerCase().includes(lowerTerm);
        // Lọc theo nội dung bài viết
        const contentMatch = (post.content || "").toLowerCase().includes(lowerTerm);

        return idMatch || nameMatch || contentMatch;
      });
    }

    // BƯỚC SẮP XẾP (SORT) - Giữ nguyên logic report nhiều lên đầu
    return result.sort((a, b) => b.reports_count - a.reports_count);
  }, [posts, searchTerm]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Quản lý bài viết
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Theo dõi các bài viết bị báo cáo, tìm kiếm theo ID/Nội dung và xử lý vi phạm.
        </Typography>
      </Box>

      {/* --- UI THANH TÌM KIẾM --- */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }} elevation={1}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm theo ID, tên người đăng hoặc nội dung..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Paper
        elevation={3}
        sx={{
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
                {processedPosts.length > 0 ? (
                  processedPosts.map((post) => {
                    const isLoadingThis = !!loadingToggles[post.id];

                    return (
                      <TableRow key={post.id} hover>
                        {/* ID bài viết */}
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

                        {/* Người đăng */}
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <AvatarUser userData={post.user} />
                            <Typography variant="body2">{post.user?.name}</Typography>
                          </Box>
                        </TableCell>

                        {/* Nội dung */}
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

                        {/* Số report */}
                        <TableCell>
                          <Chip
                            label={`${post.reports_count} report`}
                            color={post.reports_count >= 10 ? "error" : "warning"}
                            size="small"
                          />
                        </TableCell>

                        {/* Trạng thái */}
                        <TableCell>
                          <Chip
                            label={!post.is_visible ? "Đã ẩn" : "Đang hiển thị"}
                            color={!post.is_visible ? "default" : "success"}
                            size="small"
                          />
                        </TableCell>

                        {/* Hành động */}
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            size="small"
                            color={!post.is_visible ? "success" : "error"}
                            onClick={() => toggleVisibility(post.id)}
                            disabled={isLoadingThis}
                          >
                            {isLoadingThis ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : !post.is_visible ? (
                              "Hiện lại"
                            ) : (
                              "Ẩn bài"
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  // Trường hợp không tìm thấy
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Không tìm thấy bài viết nào khớp với "{searchTerm}"
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}