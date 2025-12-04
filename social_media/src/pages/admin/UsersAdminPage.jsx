import { useState, useMemo } from "react";
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Chip, Paper, CircularProgress, TextField, InputAdornment,
  Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { api } from "../../shared/api";
import AvatarUser from "../../shared/components/AvatarUser";

// 1. Helper format hiển thị cả Giờ Phút
const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  // toLocaleString tự động convert timestamptz sang giờ local của trình duyệt (VN)
  return new Date(dateString).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
};

export default function UsersAdminPage() {
  const queryClient = useQueryClient();
  const [loadingToggles, setLoadingToggles] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("status_violated");

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
      const response = await api.patch(`/admin/users/${userId}/violated`);

      const updatedUserFromApi = response.data['user'] || response.data;

      if (updatedUserFromApi) {
        // Cập nhật Optimistic Update vào cache
        queryClient.setQueryData(['users'], (oldUsers) => {
          return oldUsers?.map(u =>
            u.id === userId
              ? { ...u, ...updatedUserFromApi, is_Violated: !!updatedUserFromApi.is_Violated }
              : u
          );
        });
      } else {
        // Nếu API không trả về data, reload lại danh sách
        await queryClient.invalidateQueries({ queryKey: ['users'] });
      }

    } catch (err) {
      console.log("Lỗi: ", err);
    } finally {
      setLoadingToggles(prev => ({ ...prev, [userId]: false }));
    }
  };

  // --- LOGIC LỌC & SẮP XẾP ---
  const processedUsers = useMemo(() => {
    let result = [...users];

    // Filter
    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter((u) => {
        const nameMatch = (u.name || "").toLowerCase().includes(lowerTerm);
        const emailMatch = (u.email || "").toLowerCase().includes(lowerTerm);
        return nameMatch || emailMatch;
      });
    }

    // Sort
    return result.sort((a, b) => {
      switch (sortBy) {
        case "status_violated": return (b.is_Violated ? 1 : 0) - (a.is_Violated ? 1 : 0);
        case "status_active": return (a.is_Violated ? 1 : 0) - (b.is_Violated ? 1 : 0);
        case "created_desc": return new Date(b.created_at) - new Date(a.created_at);
        case "created_asc": return new Date(a.created_at) - new Date(b.created_at);
        case "name_asc": return (a.name || "").localeCompare(b.name || "");
        case "name_desc": return (b.name || "").localeCompare(a.name || "");
        case "id_asc": return a.id - b.id;
        case "id_desc": return b.id - a.id;
        default: return 0;
      }
    });
  }, [users, searchTerm, sortBy]);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>Quản lý người dùng</Typography>
          <Typography variant="body2" color="text.secondary">Xem danh sách, tìm kiếm và vô hiệu/kích hoạt tài khoản.</Typography>
        </Box>
      </Box>

      {/* UI THANH TÌM KIẾM & SORT (Giữ nguyên) */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }} elevation={1}>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            fullWidth variant="outlined" placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} size="small"
            slotProps={{ input: { startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) } }}
          />
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Sắp xếp theo</InputLabel>
            <Select value={sortBy} label="Sắp xếp theo" onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="status_violated">Trạng thái: Đã vô hiệu trước</MenuItem>
              {/* ... các menu item khác giữ nguyên ... */}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ overflowX: "auto", width: "100%" }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f0f2f5" }}>
                <TableCell>ID</TableCell>
                <TableCell>Người dùng</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Ngày vô hiệu</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>


            {isLoading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}><CircularProgress /> <br /> Đang tải dữ liệu...</TableCell>
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
                          <Typography component={Link} to={`/profile/${user.id}`} sx={{ textDecoration: "none", color: "primary.main", fontWeight: 600 }}>#{user.id}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <AvatarUser userData={user} />
                            <Typography variant="body2">{user.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>

                        {/* Ngày tạo */}
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDateTime(user.created_at)}
                          </Typography>
                        </TableCell>

                        {/* 3. Hiển thị NGÀY VÔ HIỆU (Đã update) */}
                        <TableCell>
                          <Typography variant="body2" color={user.disable_at ? "error.main" : "text.secondary"} fontWeight={user.disable_at ? "500" : "normal"}>
                            {formatDateTime(user.disable_at)}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip label={user.is_Violated ? "Đã vô hiệu" : "Đang hoạt động"} color={user.is_Violated ? "error" : "success"} size="small" />
                        </TableCell>

                        <TableCell align="right">
                          <Button variant="contained" size="small" color={user.is_Violated ? "success" : "error"} onClick={() => toggleUserViolated(user.id)} disabled={isLoadingThis}>
                            {isLoadingThis ? <CircularProgress size={16} color="inherit" /> : (user.is_Violated ? "Kích hoạt lại" : "Vô hiệu")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 3 }}><Typography variant="body2" color="text.secondary">Không tìm thấy...</Typography></TableCell></TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}