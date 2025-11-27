import React from "react";
import {
  Dialog, DialogTitle, DialogContent, List, ListItem,
  ListItemAvatar, ListItemText, Button, DialogActions
} from "@mui/material";
import AvatarUser from "../../shared/components/AvatarUser";

export default function ParticipantsModal({ open, onClose, participants = [] }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Thành viên nhóm ({participants.length})</DialogTitle>
      <DialogContent dividers>
        <List>
          {participants.map((p) => (
            <ListItem key={p.id}>
              <ListItemAvatar>
                <AvatarUser userData={p.user} />
              </ListItemAvatar>
              <ListItemText
                primary={p.user.name}
                secondary={p.role === "admin" ? "Quản trị viên" : "Thành viên"}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}