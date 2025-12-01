import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  Divider,
  Stack,
  CircularProgress,
} from "@mui/material";
import { Feed, Person, Tune } from "@mui/icons-material";
// 1. Import React Query
import { useQuery } from "@tanstack/react-query";
import { api } from "../../shared/api";
import PostCard from "../post/PostCard";
import FriendCard from "../profile/FriendCard";

/* -------------------- helpers -------------------- */
function useQueryParam() {
  const location = useLocation();
  return new URLSearchParams(location.search);
}

// Giữ lại helper này nếu bạn muốn highlight từ khóa sau này
const highlight = (text, kw) => {
  if (!kw) return text;
  const parts = text.split(new RegExp(`(${kw})`, "ig"));
  return parts.map((p, i) =>
    p.toLowerCase() === kw.toLowerCase() ? (
      <mark key={i} style={{ padding: 0, background: "#fff59d" }}>
        {p}
      </mark>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    )
  );
};

/* -------------------- components -------------------- */
function FilterSidebar({ keyword }) {
  const navigate = useNavigate();
  const query = useQueryParam();
  
  // Hàm chuyển hướng giữ nguyên logic
  const go = (type) =>
    navigate(`/search?query=${encodeURIComponent(keyword)}&type=${type}`);

  const type = query.get("type") || "all";

  return (
    <Box
      sx={{
        position: "sticky",
        top: 72,
        alignSelf: "flex-start",
        p: 2,
        borderRight: { md: "1px solid #eee" },
      }}
    >
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
        Bộ lọc
      </Typography>
      <List dense sx={{ width: 260, maxWidth: "100%" }}>
        <ListItemButton selected={type === "all"} onClick={() => go("all")}>
          <ListItemIcon>
            <Tune />
          </ListItemIcon>
          <ListItemText primary="Tất cả" />
        </ListItemButton>
        <ListItemButton selected={type === "posts"} onClick={() => go("posts")}>
          <ListItemIcon>
            <Feed />
          </ListItemIcon>
          <ListItemText primary="Bài viết" />
        </ListItemButton>
        <ListItemButton selected={type === "people"} onClick={() => go("people")}>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary="Mọi người" />
        </ListItemButton>
      </List>
    </Box>
  );
}

function PeopleSection({ keyword }) {
  // --- REACT QUERY CHO PEOPLE ---
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["search", "people", keyword], // Key phụ thuộc vào keyword
    queryFn: async () => {
     
      const response = await api.get(`/users?search=${keyword}`);
      return response.data;
    },
    enabled: !!keyword, // Chỉ search khi có keyword
    staleTime: 300 * 1000, // Cache 1 phút
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 3 }}>
         <CircularProgress size={20} /> <Typography>Đang tìm người dùng...</Typography>
      </Box>
    );
  }

  if (!users.length) {
    return (
        <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography color="text.secondary">Không tìm thấy người dùng nào phù hợp.</Typography>
        </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
        Mọi người
      </Typography>
      <Stack spacing={1.5}>
        {users.map((u) => (
          <Box
            key={u.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1,
              borderRadius: 2,
              "&:hover": { backgroundColor: "#f7f7f7" },
            }}
          >
            <FriendCard friend={u} defaultStatus="friends" />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

function PostsSection({ keyword }) {
  // --- REACT QUERY CHO POSTS ---
  const { data: postData = [], isLoading } = useQuery({
    queryKey: ["search", "posts", keyword],
    queryFn: async () => {
   
      const response = await api.get(`/posts?search=${keyword}`);
      // Lưu ý: API của bạn trả về response.data.data trong code cũ
      // Nếu API trả về trực tiếp mảng thì bỏ .data cuối đi nhé
      return response.data.data || response.data; 
    },
    enabled: !!keyword,
    staleTime: 300 * 1000,
  });

  if (isLoading) {
    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 3 }}>
           <CircularProgress size={20} /> <Typography>Đang tìm bài viết...</Typography>
        </Box>
      );
  }

  if (!postData.length) {
    return (
        <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography color="text.secondary">Không tìm thấy bài viết nào.</Typography>
        </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
        Bài viết
      </Typography>
      <Stack spacing={2}>
        {postData.map((p) => (
          <Card key={p.id} variant="outlined">
            <PostCard postData={p} />
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

/* -------------------- page -------------------- */
export default function SearchResultPage() {
  const query = useQueryParam();
  const keyword = query.get("query") || "";
  const type = query.get("type") || "all";

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 } }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 1.5 }}>
        Kết quả tìm kiếm cho: "{keyword}"
      </Typography>

      <Grid container spacing={2}>
        {/* Sidebar bộ lọc */}
        <Grid
          item
          xs={12}
          md={3}
          lg={2}
          sx={{ display: { xs: "none", md: "block" } }}
        >
          <FilterSidebar keyword={keyword} />
        </Grid>

        {/* Kết quả */}
        <Grid item xs={12} md={9} lg={7}>
          {(type === "all" || type === "people") && (
            <PeopleSection keyword={keyword} />
          )}
          
          {(type === "all" || type === "people") && (type === "all" || type === "posts") && (
             <Divider sx={{ my: 2 }} />
          )}

          {(type === "all" || type === "posts") && (
            <PostsSection keyword={keyword} />
          )}
          
          <Divider sx={{ my: 2 }} />
        </Grid>

        {/* Cột phải (tuỳ chọn: gợi ý, trending…) */}
        <Grid item lg={3} sx={{ display: { xs: "none", lg: "block" } }}>
          <Box
            sx={{
              position: "sticky",
              top: 72,
              p: 2,
              borderLeft: "1px solid #eee",
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              Gợi ý cho bạn
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              (Đặt quảng cáo, trending, nhóm đề xuất…)
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}