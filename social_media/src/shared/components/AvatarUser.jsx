import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate } from "react-router-dom";


export default function AvatarUser({ id = "1", name = "user", img = "image.png" }) {

  const navigate = useNavigate();

  function handleOpenProfile() {
    navigate(`/profile/${id}`);
  }


  return (
    <IconButton onClick={handleOpenProfile}>
      <Avatar alt={name} src={img} />
    </IconButton>
  );
}
