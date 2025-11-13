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

const initialUsers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "a@example.com",
    status: "active",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "b@example.com",
    status: "blocked",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "c@example.com",
    status: "active",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];

export default function UsersAdminPage() {
  const [users, setUsers] = useState(initialUsers);

  const toggleBlock = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "blocked" : "active" }
          : u
      )
    );
  };

  // (Ví dụ) ưu tiên hiển thị user bị chặn trước
  const sortedUsers = useMemo(
    () =>
      [...users].sort((a, b) =>
        a.status === b.status ? 0 : a.status === "blocked" ? -1 : 1
      ),
    [users]
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Quản lý người dùng
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Xem danh sách người dùng, trạng thái tài khoản và thao tác chặn / mở chặn.
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
              <TableCell>ID</TableCell>
              <TableCell>Người dùng</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers.map((user) => {
              const isBlocked = user.status === "blocked";
              return (
                <TableRow key={user.id} hover>
                  <TableCell>
                    {/* Click ID cũng có thể dẫn tới trang cá nhân nếu bạn muốn */}
                    <Typography
                      component={Link}
                      to={`/profile/${user.id}`}
                      sx={{
                        textDecoration: "none",
                        color: "primary.main",
                        fontWeight: 600,
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      #{user.id}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar
                        component={Link}
                        to={`/profile/${user.id}`}
                        src={user.avatar}
                        alt={user.name}
                        sx={{ width: 36, height: 36, cursor: "pointer" }}
                      />
                      <Typography variant="body2">{user.name}</Typography>
                    </Box>
                  </TableCell>

                  <TableCell>{user.email}</TableCell>

                  <TableCell>
                    <Chip
                      label={isBlocked ? "Đã chặn" : "Đang hoạt động"}
                      color={isBlocked ? "error" : "success"}
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Button
                      variant="contained"
                      size="small"
                      color={isBlocked ? "success" : "error"}
                      onClick={() => toggleBlock(user.id)}
                    >
                      {isBlocked ? "Mở chặn" : "Chặn"}
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
