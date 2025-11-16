import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate } from "react-router-dom";


export default function AvatarUser({ userData }) {

  const navigate = useNavigate();


  function handleOpenProfile() {
    if (userData.id) {
      navigate(`/profile/${userData.id}`);
    }
  }


  return (
    <IconButton onClick={handleOpenProfile}>
      <Avatar alt={userData.name} src={userData.avatarUrl} />
    </IconButton>
  );
}
