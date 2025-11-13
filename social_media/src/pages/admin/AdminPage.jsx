import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";

export default function AdminPage() {
  const stats = [
    { label: "Tổng số người dùng", value: 1532 },
    { label: "Tổng số bài viết", value: 874 },
    { label: "Báo cáo vi phạm hôm nay", value: 12 },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Tổng quan nhanh về hệ thống mạng xã hội.
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {stats.map((item) => (
          <Grid item xs={12} md={4} key={item.label}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
