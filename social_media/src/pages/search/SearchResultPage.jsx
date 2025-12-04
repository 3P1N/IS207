import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Divider,
  Stack,
  CircularProgress,
  Chip,
  Avatar,
  Paper,
  alpha,
  Grid,
  useTheme,
  Container
} from "@mui/material";

import {
  Feed,
  Person,
  Tune,
  Search as SearchIcon,
  Group
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../shared/api";
import PostCard from "../post/PostCard";
import FriendCard from "../profile/FriendCard";

/* -------------------- helpers -------------------- */
function useQueryParam() {
  const location = useLocation();
  return new URLSearchParams(location.search);
}

/* -------------------- components -------------------- */
function FilterTabs({ keyword, currentType }) {
  const navigate = useNavigate();
  const theme = useTheme();

  const go = (type) =>
    navigate(`/search?query=${encodeURIComponent(keyword)}&type=${type}`);

  const tabs = [
    { value: "all", label: "Tất cả", icon: <Tune /> },
    { value: "posts", label: "Bài viết", icon: <Feed /> },
    { value: "people", label: "Mọi người", icon: <Person /> }
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Stack
        direction="row"
        sx={{
          overflowX: "auto",
          '&::-webkit-scrollbar': { height: 6 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
            borderRadius: 3
          }
        }}
      >
        {tabs.map((tab) => (
          <Box
            key={tab.value}
            onClick={() => go(tab.value)}
            sx={{
              flex: { xs: 1, sm: 'none' },
              minWidth: { xs: 'auto', sm: 140 },
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              cursor: 'pointer',
              borderBottom: currentType === tab.value
                ? `3px solid ${theme.palette.primary.main}`
                : '3px solid transparent',
              backgroundColor: currentType === tab.value
                ? alpha(theme.palette.primary.main, 0.08)
                : 'transparent',
              color: currentType === tab.value
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
              fontWeight: currentType === tab.value ? 600 : 400,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main
              }
            }}
          >
            {tab.icon}
            <Typography variant="body2" fontWeight="inherit">
              {tab.label}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

function PeopleSection({ keyword }) {
  const theme = useTheme();
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["search", "people", keyword],
    queryFn: async () => {
      const response = await api.get(`/users?search=${keyword}`);
      return response.data;
    },
    enabled: !!keyword,
    staleTime: 300 * 1000,
  });

  if (isLoading) {
    return (
      <Card
        elevation={0}
        sx={{
          mb: 3,
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={24} />
          <Typography color="text.secondary">Đang tìm người dùng...</Typography>
        </Stack>
      </Card>
    );
  }

  if (!users.length) {
    return (
      <Card
        elevation={0}
        sx={{
          mb: 3,
          p: 4,
          textAlign: 'center',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.info.main, 0.02)
        }}
      >
        <Person sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
        <Typography color="text.secondary">
          Không tìm thấy người dùng nào phù hợp
        </Typography>
      </Card>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Group color="primary" />
        <Typography variant="h6" fontWeight={600}>
          Mọi người
        </Typography>
        <Chip
          label={users.length}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Stack>

      {/* --- PHẦN ĐÃ SỬA: RESPONSIVE GRID --- */}
      <Box
        sx={{
          display: 'grid',
          // Mobile (xs): 1 cột
          // Tablet nhỏ (sm): 2 cột
          // Desktop (md trở lên): 3 cột
          gridTemplateColumns: {
            xs: '1fr', 
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 2, // 16px
          width: '100%'
        }}
      >
        {users.map((u) => (
          <Box key={u.id}>
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                transition: 'all 0.2s ease',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                '&:hover': {
                  boxShadow: theme.shadows[2],
                  borderColor: theme.palette.primary.main
                }
              }}
            >
              <Box sx={{ width: '100%', p: 1 }}>
                <FriendCard friend={u} defaultStatus="friends" />
              </Box>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function PostsSection({ keyword }) {
  const theme = useTheme();
  const { data: postData = [], isLoading } = useQuery({
    queryKey: ["search", "posts", keyword],
    queryFn: async () => {
      const response = await api.get(`/posts?search=${keyword}`);
      return response.data.data || response.data;
    },
    enabled: !!keyword,
    staleTime: 300 * 1000,
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          mb: 3,
          p: 3,
          textAlign: 'center'
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
          <CircularProgress size={24} />
          <Typography color="text.secondary">Đang tìm bài viết...</Typography>
        </Stack>
      </Box>
    );
  }

  if (!postData.length) {
    return (
      <Box
        sx={{
          mb: 3,
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
          bgcolor: alpha(theme.palette.info.main, 0.02)
        }}
      >
        <Feed sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
        <Typography color="text.secondary">
          Không tìm thấy bài viết nào
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Feed color="primary" />
        <Typography variant="h6" fontWeight={600}>
          Bài viết
        </Typography>
        <Chip
          label={postData.length}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Stack>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {postData.map((p, index) => (
          <Box key={p.id} sx={{ width: '100%', maxWidth: '672px' }}>
            <PostCard postData={p} index={index} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}


/* -------------------- page -------------------- */
export default function SearchResultPage() {
  const query = useQueryParam();
  const keyword = query.get("query") || "";
  const type = query.get("type") || "all";
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: alpha(theme.palette.background.default, 0.5),
        py: { xs: 2, md: 3 }
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            mb: 3,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 48,
                height: 48
              }}
            >
              <SearchIcon />
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  color: theme.palette.text.primary,
                  mb: 0.5
                }}
              >
                Kết quả tìm kiếm
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tìm kiếm cho: <strong>"{keyword}"</strong>
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Filter Tabs */}
        <FilterTabs keyword={keyword} currentType={type} />

        {/* Main Content - Centered */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: '800px' }}>
            {(type === "all" || type === "people") && (
              <PeopleSection keyword={keyword} />
            )}

            {type === "all" && (
              <Divider sx={{ my: 3 }} />
            )}

            {(type === "all" || type === "posts") && (
              <PostsSection keyword={keyword} />
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}