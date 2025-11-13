// src/pages/admin/PostsAdminPage.jsx
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
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";

const initialPosts = [
  {
    id: 101,
    authorId: 1,
    authorName: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/150?img=1",
    content: "Hôm nay trời đẹp quá!",
    status: "visible",
    reports: 15,
  },
  {
    id: 102,
    authorId: 2,
    authorName: "Trần Thị B",
    avatar: "https://i.pravatar.cc/150?img=2",
    content: "Code React mệt ghê :))",
    status: "hidden",
    reports: 9,
  },
  {
    id: 103,
    authorId: 3,
    authorName: "Lê Văn C",
    avatar: "https://i.pravatar.cc/150?img=3",
    content: "Ai đi uống trà sữa không?",
    status: "visible",
    reports: 3,
  },
];

export default function PostsAdminPage() {
  const [posts, setPosts] = useState(initialPosts);

  const toggleVisibility = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "visible" ? "hidden" : "visible" }
          : p
      )
    );
  };

  // Sort theo số report giảm dần
  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => b.reports - a.reports),
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
          <TableBody>
            {sortedPosts.map((post) => {
              const isHidden = post.status === "hidden";
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
                      <Avatar
                        component={Link}
                        to={`/profile/${post.authorId}`}
                        src={post.avatar}
                        alt={post.authorName}
                        sx={{
                          width: 36,
                          height: 36,
                          cursor: "pointer",
                        }}
                      />
                      <Typography variant="body2">{post.authorName}</Typography>
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
                      label={`${post.reports} report`}
                      color={post.reports >= 10 ? "error" : "warning"}
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
                      {isHidden ? "Hiện lại" : "Ẩn bài"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
