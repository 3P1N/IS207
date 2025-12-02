import React, { useState, useMemo } from "react";
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Chip, Paper, CircularProgress
} from "@mui/material";
import { useQuery, useQueryClient } from '@tanstack/react-query'; // Thêm useQueryClient
import { Link } from "react-router-dom";
import { api } from "../../shared/api";
import AvatarUser from "../../shared/components/AvatarUser";

export default function UsersAdminPage() {
  const queryClient = useQueryClient(); // Dùng để làm mới data sau khi update
  const [loadingToggles, setLoadingToggles] = useState({});

  // --- 1. FETCH DATA VỚI REACT QUERY ---
  const fetchUsers = async () => {
    const response = await api.get("/admin/users");
    // Chuẩn hóa dữ liệu và RETURN nó
    return (response.data || []).map((u) => ({
      ...u,
      is_Violated: !!u.is_Violated,
    }));
  };

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 300 * 1000, // Trong 60s, vào lại trang sẽ KHÔNG loading lại
    refetchOnWindowFocus: false, // Tùy chọn: ko fetch lại khi tab web được focus
  });

  // --- 2. HANDLE ACTION (Chặn/Mở chặn) ---
  const toggleUserViolated = async (userId) => {
    setLoadingToggles(prev => ({ ...prev, [userId]: true }));

    try {
      await api.patch(`/admin/users/${userId}/violated`);

      // QUAN TRỌNG: Sau khi update xong, báo cho React Query biết key ['users'] đã cũ
      // Nó sẽ tự động fetch lại danh sách mới nhất ở background
      await queryClient.invalidateQueries({ queryKey: ['users'] });

    } catch (err) {
      console.log("Lỗi khi chỉnh violated user: ", err);
    } finally {
      setLoadingToggles(prev => ({ ...prev, [userId]: false }));
    }
  };

  // --- 3. SẮP XẾP (Logic giữ nguyên) ---
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aBlocked = !!a.is_Violated;
      const bBlocked = !!b.is_Violated;
      if (aBlocked === bBlocked) return 0;
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

      <Paper elevation={3} sx={{ mt: 2, borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ overflowX: "auto", width: "100%" }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f0f2f5" }}>
                <TableCell>ID</TableCell>
                <TableCell>Người dùng</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>

            {/* Dùng biến isLoading của React Query */}
            {isLoading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <CircularProgress /> <br /> Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {sortedUsers.map((user) => {
                  const isLoadingThis = !!loadingToggles[user.id];
                  return (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Typography component={Link} to={`/profile/${user.id}`}
                          sx={{ textDecoration: "none", color: "primary.main", fontWeight: 600 }}>
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
                          {isLoadingThis ? <CircularProgress size={16} color="inherit" /> : (user.is_Violated ? "Mở chặn" : "Chặn")}
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