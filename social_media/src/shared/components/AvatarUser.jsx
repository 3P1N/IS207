import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge'; // Import Badge
import SecurityIcon from '@mui/icons-material/Security'; // Icon cho Admin
import { useNavigate } from "react-router-dom";

export default function AvatarUser({ userData }) {
  const navigate = useNavigate();
  const isAdmin = userData.role === 'admin'; // Biến kiểm tra

  function handleOpenProfile() {
    if (userData.id) {
      navigate(`/profile/${userData.id}`);
    }
  }

  return (
    <IconButton onClick={handleOpenProfile}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          isAdmin ? (
            <SecurityIcon 
              sx={{ 
                width: 22, 
                height: 22, 
                color: '#1976d2', // Màu xanh đặc trưng
                bgcolor: 'white', // Nền trắng để icon nổi bật trên avatar
                borderRadius: '50%',
                border: '2px solid white' // Viền trắng tách biệt
              }} 
            />
          ) : null
        }
      >
        <Avatar alt={userData.name} src={userData.avatarUrl} />
      </Badge>
    </IconButton>
  );
}