import React, { useState, useMemo } from "react";
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Chip, Paper, CircularProgress, TextField, InputAdornment
} from "@mui/material";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search"; // Import icon tìm kiếm
import { api } from "../../shared/api";
import AvatarUser from "../../shared/components/AvatarUser";

export default function UsersAdminPage() {
  const queryClient = useQueryClient();
  const [loadingToggles, setLoadingToggles] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // <--- 1. State lưu từ khóa tìm kiếm

  // --- FETCH DATA ---
  const fetchUsers = async () => {
    const response = await api.get("/admin/users");
    return (response.data || []).map((u) => ({
      ...u,
      is_Violated: !!u.is_Violated,
    }));
  };

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 300 * 1000,
    refetchOnWindowFocus: false,
  });

  // --- HANDLE ACTION ---
  const toggleUserViolated = async (userId) => {
    setLoadingToggles(prev => ({ ...prev, [userId]: true }));
    try {
      await api.patch(`/admin/users/${userId}/violated`);
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (err) {
      console.log("Lỗi: ", err);
    } finally {
      setLoadingToggles(prev => ({ ...prev, [userId]: false }));
    }
  };

  // --- 2. LOGIC LỌC & SẮP XẾP ---
  const processedUsers = useMemo(() => {
    let result = [...users];

    // BƯỚC LỌC (FILTER)
    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter((u) => {
        const nameMatch = (u.name || "").toLowerCase().includes(lowerTerm);
        const emailMatch = (u.email || "").toLowerCase().includes(lowerTerm);
        return nameMatch || emailMatch;
      });
    }

    // BƯỚC SẮP XẾP (SORT - Giữ nguyên logic cũ)
    return result.sort((a, b) => {
      const aBlocked = !!a.is_Violated;
      const bBlocked = !!b.is_Violated;
      if (aBlocked === bBlocked) return 0;
      return aBlocked ? -1 : 1;
    });
  }, [users, searchTerm]); // Chạy lại khi data thay đổi hoặc từ khóa thay đổi

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Quản lý người dùng
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Xem danh sách, tìm kiếm và chặn/mở chặn tài khoản.
          </Typography>
        </Box>
      </Box>

      {/* --- 3. UI THANH TÌM KIẾM --- */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }} elevation={1}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm theo tên hoặc email..."
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

      <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
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
                {processedUsers.length > 0 ? (
                  processedUsers.map((user) => {
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
                  })
                ) : (
                  // Hiển thị khi không tìm thấy kết quả
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Không tìm thấy người dùng nào khớp với "{searchTerm}"
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