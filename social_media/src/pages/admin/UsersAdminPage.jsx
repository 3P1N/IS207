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
} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from "react-router-dom";
import { api } from "../../shared/api";
import AvatarUser from "../../shared/components/AvatarUser";

export default function UsersAdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingToggles, setLoadingToggles] = useState({});

  const toggleUserViolated = async (userId) => {
    setLoadingToggles(prev => ({ ...prev, [userId]: true }));

    try {
      const response = await api.patch(`/admin/users/${userId}/violated`);
      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, is_Violated: !u.is_Violated } : u
        )
      );

    } catch (err) {
      console.log("Lỗi khi chỉnh violated user: ", err);
    } finally {
      setLoadingToggles(prev => ({ ...prev, [userId]: false }));
    }
  };

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/users");
      // chuẩn hóa dữ liệu (ép boolean cho is_Violated)
      const normalized = (response.data || []).map((u) => ({
        ...u,
        is_Violated: !!u.is_Violated,
      }));
      setUsers(normalized);
    } catch (err) {
      console.log("Lỗi khi lấy danh sách người dùng: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // ưu tiên hiển thị user bị chặn trước
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aBlocked = !!a.is_Violated;
      const bBlocked = !!b.is_Violated;
      // nếu cả 2 cùng trạng thái => giữ order
      if (aBlocked === bBlocked) return 0;
      // đặt user bị chặn (true) lên trước
      return aBlocked ? -1 : 1;
    });
  }, [users]);

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

          {loading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  Loading users...
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {sortedUsers.map((user) => {
                const isBlocked = !!user.is_Violated;
                const isLoadingThis = !!loadingToggles[user.id];

                return (
                  <TableRow key={user.id} hover>
                    <TableCell>
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
                        <AvatarUser userData={user} />
                        <Typography variant="body2">{user.name}</Typography>
                      </Box>
                    </TableCell>

                    <TableCell>{user.email}</TableCell>

                    <TableCell>
                      <Chip
                        label={user.is_Violated ? "Đã chặn" : "Đang hoạt động"}
                        color={user.is_Violated ? "error" : "success"}
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        color={user.is_Violated ? "success" : "error"}
                        onClick={() => toggleUserViolated(user.id)}
                        disabled={isLoadingThis}
                      >
                        {isLoadingThis ? (
                          <CircularProgress size={16} />
                        ) : (
                          user.is_Violated ? "Mở chặn" : "Chặn"
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
