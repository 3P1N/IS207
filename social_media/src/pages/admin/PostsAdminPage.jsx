// src/pages/admin/PostsAdminPage.jsx
import React, { useState, useMemo, useEffect } from "react";
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
  Avatar,
} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import AvatarUser from "../../shared/components/AvatarUser";
import { Link } from "react-router-dom";
import { api } from "../../shared/api";


export default function PostsAdminPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingToggles, setLoadingToggles] = useState({});

  const toggleVisibility = async (postId) => {
    setLoadingToggles(prev => ({ ...prev, [postId]: true }));

    try {
      const response = await api.patch(`/admin/posts/${postId}/is_visible`);
      setPosts(prev =>
        prev.map(p =>
          p.id === postId ? { ...p, is_visible: !p.is_visible } : p
        )
      );

    } catch (err) {
      console.log("Lỗi khi chỉnh violated user: ", err);
    } finally {
      setLoadingToggles(prev => ({ ...prev, [postId]: false }));
    }
  }
  const getPostsViolation = async () => {
    setLoading(true);
    try {
      const response = await api.get("admin/posts/violation");
      console.log(response.data);
      setPosts(response.data);
    } catch (err) {
      console.log("Lỗi khi lấy bài viết vi phạm: ", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPostsViolation();
  }, []);


  // Sort theo số report giảm dần
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
        <Table>
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
          {loading ?
            (<TableBody>
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  Loading posts...
                </TableCell>
              </TableRow>
            </TableBody>
            ) :
            (<TableBody>
              {sortedPosts.map((post) => {
                const isHidden = post.is_visible;
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
                        <AvatarUser
                          userData={post.user}
                        />
                        <Typography variant="body2">{post.user.name}</Typography>
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
                        label={isHidden ? "Đã ẩn" : "Đang hiển thị"}
                        color={isHidden ? "default" : "success"}
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => toggleVisibility(post.id)}
                      >
                        {isLoadingThis ? (
                          <CircularProgress size={16} sx={{ color: '#fff' }} />
                        ) : (
                          isHidden ? "Hiện lại" : "Ẩn bài"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            )}

        </Table>
      </Paper>
    </Box>
  );
}
