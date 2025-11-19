import React, { useMemo } from "react";
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

/* -------------------- helpers -------------------- */
function useQuery() {
  const location = useLocation();
  console.log("location.search:", location.search);
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
        <ListItemButton selected onClick={() => go("all")}>
          <ListItemIcon><Tune /></ListItemIcon>
          <ListItemText primary="Tất cả" />
        </ListItemButton>
        <ListItemButton onClick={() => go("posts")}>
          <ListItemIcon><Feed /></ListItemIcon>
          <ListItemText primary="Bài viết" />
        </ListItemButton>
        <ListItemButton onClick={() => go("people")}>
          <ListItemIcon><Person /></ListItemIcon>
          <ListItemText primary="Mọi người" />
        </ListItemButton>
        
      </List>
    </Box>
  );
}

function PeopleSection({ keyword }) {
  const items = useMemo(() => {
    if (!keyword) return MOCK_PEOPLE;
    return MOCK_PEOPLE.filter((u) =>
      (u.name + " " + u.bio).toLowerCase().includes(keyword.toLowerCase())
    );
  }, [keyword]);

  if (!items.length) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
        Mọi người
      </Typography>
      <Stack spacing={1.5}>
        {items.map((u) => (
          <>
          <FriendCard/>
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
            <Avatar src={u.avatar}>{u.name[0]}</Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600}>{highlight(u.name, keyword)}</Typography>
              <Typography variant="body2" color="text.secondary">
                {highlight(u.bio, keyword)}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="contained">Kết bạn</Button>
              <Button size="small" variant="outlined">Nhắn tin</Button>
            </Stack>
          </Box>
          </>
        ))}
      </Stack>
    </Box>
  );
}

function PostsSection({ keyword }) {
  const posts = useMemo(() => {
    if (!keyword) return MOCK_POSTS;
    return MOCK_POSTS.filter((p) =>
      (p.content + " " + p.author.name)
        .toLowerCase()
        .includes(keyword.toLowerCase())
    );
  }, [keyword]);

  if (!posts.length) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
        Bài viết
      </Typography>
      <Stack spacing={2}>
        {posts.map((p) => (
          <Card key={p.id} variant="outlined">
            <CardHeader
              avatar={<Avatar>{p.author.name[0]}</Avatar>}
              title={<Typography fontWeight={600}>{highlight(p.author.name, keyword)}</Typography>}
              subheader={p.time}
            />
            <CardContent>
              <Typography variant="body1">{highlight(p.content, keyword)}</Typography>
              {p.image && (
                <Box sx={{ mt: 1, borderRadius: 2, overflow: "hidden" }}>
                  <img src={p.image} alt="" style={{ width: "100%", display: "block" }} />
                </Box>
              )}
              {!!p.tags?.length && (
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                  {p.tags.map((t) => <Chip key={t} label={t} size="small" />)}
                </Stack>
              )}
            </CardContent>
            <CardActions sx={{ pt: 0 }}>
              <Button size="small">Thích</Button>
              <Button size="small">Bình luận</Button>
              <Button size="small">Chia sẻ</Button>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

function GroupsSection({ keyword }) {
  const groups = useMemo(() => {
    if (!keyword) return MOCK_GROUPS;
    return MOCK_GROUPS.filter((g) =>
      g.name.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [keyword]);

  if (!groups.length) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
        Nhóm
      </Typography>
      <Stack spacing={1.5}>
        {groups.map((g) => (
          <Box key={g.id} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar variant="rounded">G</Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600}>{highlight(g.name, keyword)}</Typography>
              <Typography variant="body2" color="text.secondary">
                {g.members.toLocaleString()} thành viên
              </Typography>
            </Box>
            <Button variant="contained" size="small">Tham gia</Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

/* -------------------- page -------------------- */
export default function SearchResultPage() {
  const query = useQuery();
  const keyword = query.get("query") || "";

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
          <PeopleSection keyword={keyword} />
          <Divider sx={{ my: 2 }} />
          <PostsSection keyword={keyword} />
          <Divider sx={{ my: 2 }} />
          <GroupsSection keyword={keyword} />
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
