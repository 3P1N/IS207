"use client";

import { createContext, useContext, useState, useCallback } from "react";

const FriendContext = createContext(undefined);

export function FriendProvider({ children }) {
  const [friendRequests, setFriendRequests] = useState([]);

  const sendFriendRequest = useCallback(
    (fromUserId, fromUsername, toUserId, fromAvatar) => {
      const newRequest = {
        id: String(friendRequests.length + 1),
        fromUserId,
        fromUsername,
        fromAvatar,
        toUserId,
        createdAt: new Date(),
        status: "pending",
      };
      setFriendRequests((prev) => [...prev, newRequest]);
    },
    [friendRequests.length]
  );

  const acceptFriendRequest = useCallback((requestId, fromUserId, toUserId) => {
    setFriendRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "accepted" } : r))
    );
  }, []);

  const rejectFriendRequest = useCallback((requestId) => {
    setFriendRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "rejected" } : r))
    );
  }, []);

  const removeFriend = useCallback((userId1, userId2) => {
    // Handled by auth-context externally
  }, []);

  const blockUser = useCallback((userId, blockedUserId) => {
    // Handled by auth-context externally
  }, []);

  const unblockUser = useCallback((userId, blockedUserId) => {
    // Handled by auth-context externally
  }, []);

  const searchUsers = useCallback((query, allUsers) => {
    const lowerQuery = query.toLowerCase();
    return allUsers.filter(
      (u) =>
        u.username.toLowerCase().includes(lowerQuery) ||
        u.email.toLowerCase().includes(lowerQuery)
    );
  }, []);

  return (
    <FriendContext.Provider
      value={{
        friendRequests,
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        removeFriend,
        blockUser,
        unblockUser,
        searchUsers,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
}

export function useFriend() {
  const context = useContext(FriendContext);
  if (context === undefined) {
    throw new Error("useFriend must be used within a FriendProvider");
  }
  return context;
}
