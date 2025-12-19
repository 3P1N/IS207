import { useState, useMemo } from "react";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  TableSortLabel,
  Stack
} from "@mui/material";
// 1. Import React Query hooks
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SearchIcon from "@mui/icons-material/Search"; // Import icon tìm kiếm
import AvatarUser from "../../shared/components/AvatarUser";
import { Link } from "react-router-dom";
import { api } from "../../shared/api";
import ReportDetailModal from "./ReportDetailModal";

export default function PostsAdminPage() {
  const queryClient = useQueryClient();
  const [loadingToggles, setLoadingToggles] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("reports_desc"); // State cho sort
  const [viewingReportPostId, setViewingReportPostId] = useState(null);
  // Thay đổi để hỗ trợ sort đa tiêu chí
  const [sortCriteria, setSortCriteria] = useState([
    { column: "reports_count", order: "desc" }
  ]);
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

  // Hàm xử lý sort đa tiêu chí khi click vào header
  const handleSort = (column) => {
    setSortCriteria(prevCriteria => {
      const existingIndex = prevCriteria.findIndex(c => c.column === column);
      
      if (existingIndex >= 0) {
        // Nếu cột đã tồn tại, thay đổi thứ tự
        const newCriteria = [...prevCriteria];
        if (newCriteria[existingIndex].order === "asc") {
          newCriteria[existingIndex].order = "desc";
        } else {
          // Nếu đã desc, xóa khỏi danh sách sort
          newCriteria.splice(existingIndex, 1);
        }
        return newCriteria;
      } else {
        // Nếu cột chưa tồn tại, thêm vào với order "asc"
        return [...prevCriteria, { column, order: "asc" }];
      }
    });
  };

  // Hàm lấy thông tin sort cho một cột
  const getSortInfo = (column) => {
    const criterion = sortCriteria.find(c => c.column === column);
    return criterion ? { active: true, direction: criterion.order } : { active: false, direction: "asc" };
  };

  // --- 4. LỌC & SẮP XẾP ĐA TIÊU CHÍ ---
  const processedPosts = useMemo(() => {
    let result = [...posts];

    // BƯỚC LỌC (FILTER)
    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter((post) => {
        const idMatch = String(post.id).includes(lowerTerm);
        const nameMatch = (post.user?.name || "").toLowerCase().includes(lowerTerm);
        const contentMatch = (post.content || "").toLowerCase().includes(lowerTerm);
        return idMatch || nameMatch || contentMatch;
      });
    }

    // BƯỚC SẮP XẾP ĐA TIÊU CHÍ
    return result.sort((a, b) => {
      // Duyệt qua từng tiêu chí sort theo thứ tự ưu tiên
      for (const criterion of sortCriteria) {
        let comparison = 0;
        
        switch (criterion.column) {
          case "id":
            comparison = a.id - b.id;
            break;
          case "user_name":
            comparison = (a.user?.name || "").localeCompare(b.user?.name || "");
            break;
          case "content":
            comparison = (a.content || "").localeCompare(b.content || "");
            break;
          case "reports_count":
            comparison = a.reports_count - b.reports_count;
            break;
          case "created_at":
            comparison = new Date(a.created_at) - new Date(b.created_at);
            break;
          case "status":
            comparison = (a.is_visible ? 1 : 0) - (b.is_visible ? 1 : 0);
            break;
          default:
            continue;
        }
        
        // Áp dụng thứ tự sort
        const result = criterion.order === "asc" ? comparison : -comparison;
        
        // Nếu khác nhau, trả về kết quả
        if (result !== 0) {
          return result;
        }
        
        // Nếu bằng nhau, tiếp tục với tiêu chí tiếp theo
      }
      
      // Nếu tất cả tiêu chí đều bằng nhau, fallback to old sorting logic
      switch (sortBy) {
        case "reports_desc":
          return b.reports_count - a.reports_count;
        case "reports_asc":
          return a.reports_count - b.reports_count;
        case "date_desc":
          return new Date(b.created_at) - new Date(a.created_at);
        case "date_asc":
          return new Date(a.created_at) - new Date(b.created_at);
        case "status_hidden":
          return (b.is_visible ? 0 : 1) - (a.is_visible ? 0 : 1);
        case "status_visible":
          return (a.is_visible ? 0 : 1) - (b.is_visible ? 0 : 1);
        default:
          return 0;
      }
    });
  }, [posts, searchTerm, sortBy, sortCriteria]);

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

      {/* --- UI THANH TÌM KIẾM & HIỂN THỊ SORT --- */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }} elevation={1}>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'flex-start' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tìm kiếm theo ID, tên người đăng hoặc nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }
            }}
          />
          
          {/* Hiển thị các tiêu chí sort đang áp dụng */}
          {sortCriteria.length > 0 && (
            <Box sx={{ minWidth: 'fit-content' }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                Đang sắp xếp theo:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {sortCriteria.map((criterion, index) => {
                  const columnNames = {
                    id: "ID bài",
                    user_name: "Người đăng",
                    content: "Nội dung",
                    reports_count: "Số report",
                    created_at: "Ngày tạo",
                    status: "Trạng thái"
                  };
                  return (
                    <Chip
                      key={criterion.column}
                      label={`${index + 1}. ${columnNames[criterion.column]} (${criterion.order === "asc" ? "↑" : "↓"})`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      onDelete={() => {
                        setSortCriteria(prev => prev.filter(c => c.column !== criterion.column));
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>
          )}
        </Box>
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
                <TableCell>
                  <TableSortLabel
                    active={getSortInfo("id").active}
                    direction={getSortInfo("id").direction}
                    onClick={() => handleSort("id")}
                  >
                    ID bài
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={getSortInfo("user_name").active}
                    direction={getSortInfo("user_name").direction}
                    onClick={() => handleSort("user_name")}
                  >
                    Người đăng
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={getSortInfo("content").active}
                    direction={getSortInfo("content").direction}
                    onClick={() => handleSort("content")}
                  >
                    Nội dung
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={getSortInfo("reports_count").active}
                    direction={getSortInfo("reports_count").direction}
                    onClick={() => handleSort("reports_count")}
                  >
                    Số report
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={getSortInfo("status").active}
                    direction={getSortInfo("status").direction}
                    onClick={() => handleSort("status")}
                  >
                    Trạng thái
                  </TableSortLabel>
                </TableCell>
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
                          <Tooltip title="Click để xem chi tiết báo cáo">
                            <Chip
                              label={`${post.reports_count} report`}
                              color={post.reports_count >= 10 ? "error" : "warning"}
                              size="small"
                              onClick={() => setViewingReportPostId(post.id)} // Set ID để mở modal
                              sx={{
                                cursor: "pointer",
                                "&:hover": { opacity: 0.8 }
                              }}
                            />
                          </Tooltip>
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
      <ReportDetailModal
        open={!!viewingReportPostId} // Mở khi có ID
        postId={viewingReportPostId}
        onClose={() => setViewingReportPostId(null)}
      />
    </Box>
  );
}