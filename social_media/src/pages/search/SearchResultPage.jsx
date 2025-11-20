import React, { useContext, useState, useEffect, useMemo } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import { Feed, Person, Groups, Tune } from "@mui/icons-material";
import { api } from "../../shared/api";
import { AuthContext } from "../../router/AuthProvider";
import PostCard from "../post/PostCard";
import FriendCard from "../profile/FriendCard";
/* -------------------- helpers -------------------- */
function useQuery() {
  const location = useLocation();
  // console.log("location.search:", location.search);
  return new URLSearchParams(location.search);
}


const highlight = (text, kw) => {
  if (!kw) return text;
  const parts = text.split(new RegExp(`(${kw})`, "ig"));
  return parts.map((p, i) =>
    p.toLowerCase() === kw.toLowerCase() ? (
      <mark key={i} style={{ padding: 0, background: "#fff59d" }}>{p}</mark>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    )
  );
};


/* -------------------- mock data -------------------- */
const MOCK_PEOPLE = [
  { id: "u1", name: "Huy Forum", avatar: "", bio: "Creator, chia sẻ mẹo học tiếng Anh." },
  { id: "u2", name: "Duy Nguyễn", avatar: "", bio: "Viết review, bàn luận chủ đề nóng." },
  { id: "u3", name: "Hội Học Tiếng Anh", avatar: "", bio: "Cộng đồng luyện nói & phát âm." },
];

const MOCK_POSTS = [
  {
    id: "p1",
    author: { name: "This is Mờ Hờn 2.0", avatar: "" },
    time: "3 giờ",
    content:
      'Khá Tiếng Anh lên clip bắt bẻ phát âm của "Huy Forum" — Huy Forum bình luận thiện chí...',
    image: null,
    tags: ["Drama", "English"],
  },
  {
    id: "p2",
    author: { name: "Duy Nguyễn", avatar: "" },
    time: "46 phút",
    content:
      "Tiếng Anh về VN sao nó là cái gì đó ghê gớm dữ thần vậy trời mà sao sân si quá vậy?",
    image: null,
    tags: ["Opinion"],
  },
];

const MOCK_GROUPS = [
  { id: "g1", name: "Cộng đồng Học Tiếng Anh", members: 125000 },
];

/* -------------------- components -------------------- */
function FilterSidebar({ keyword }) {
  const navigate = useNavigate();
  const go = (type) => navigate(`/search?query=${encodeURIComponent(keyword)}&type=${type}`);
  const query = useQuery();

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
          <ListItemIcon><Tune /></ListItemIcon>
          <ListItemText primary="Tất cả" />
        </ListItemButton>
        <ListItemButton selected={type === "posts"} onClick={() => go("posts")}>
          <ListItemIcon><Feed /></ListItemIcon>
          <ListItemText primary="Bài viết" />
        </ListItemButton>
        <ListItemButton selected={type === "people"} onClick={() => go("people")}>
          <ListItemIcon><Person /></ListItemIcon>
          <ListItemText primary="Mọi người" />
        </ListItemButton>

      </List>
    </Box>
  );
}

function PeopleSection({ keyword }) {
  const [users, setUsersData] = useState([]);
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const getUsersData = async () => {
    setLoading(true);
    try {
      console.log("đang lấy dữ liệu");
      const response = await api.get(`/users?search=${keyword}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      console.log(response.data);
      setUsersData(response.data);
    } catch (err) {
      console.log("lỗi khi lấy user: ", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUsersData();
  }, [keyword]);

  if (loading) {
    return <div>Loading People...</div>; // hiển thị khi đang load
  }

  if (!users.length) {
    return <div>No matching people</div>; // khi load xong mà không có người
  }

  return (

    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
        Mọi người
      </Typography>
      <Stack spacing={1.5}>
        {users.map((u) => (
          <>

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
          </>
        ))}
      </Stack>
    </Box>
  );
}


function PostsSection({ keyword }) {
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState([]);
  const { token } = useContext(AuthContext);
  const getPostsData = async () => {
    setLoading(true);
    try {
      console.log("đang lấy dữ liệu");
      const response = await api.get(`/posts?search=${keyword}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      setPostData(response.data.data);
    } catch (err) {
      console.log("Lỗi khi load posts: ", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPostsData();
  }, [keyword]);

  if (loading) {
    return <div>Loading Posts...</div>; // hiển thị khi đang load
  }

  if (!postData.length) {
    return <div>No matching posts</div>; // khi load xong mà không có người
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
  const query = useQuery();
  const keyword = query.get("query") || "";
  const type = query.get("type") || "all";

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 } }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 1.5 }}>
        Kết quả tìm kiếm cho: "{keyword}"
      </Typography>

      <Grid container spacing={2}>
        {/* Sidebar bộ lọc */}
        <Grid item xs={12} md={3} lg={2} sx={{ display: { xs: "none", md: "block" } }}>
          <FilterSidebar keyword={keyword} />
        </Grid>

        {/* Kết quả */}
        <Grid item xs={12} md={9} lg={7}>
          {type === "all" || type === "people" ? <PeopleSection keyword={keyword} /> : null}
          <Divider sx={{ my: 2 }} />
          {type === "all" || type === "posts" ? <PostsSection keyword={keyword} /> : null}
          <Divider sx={{ my: 2 }} />

        </Grid>

        {/* Cột phải (tuỳ chọn: gợi ý, trending…) */}
        <Grid item lg={3} sx={{ display: { xs: "none", lg: "block" } }}>
          <Box sx={{ position: "sticky", top: 72, p: 2, borderLeft: "1px solid #eee" }}>
            <Typography variant="subtitle1" fontWeight={700}>Gợi ý cho bạn</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              (Đặt quảng cáo, trending, nhóm đề xuất…)
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
