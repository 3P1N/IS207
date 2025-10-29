"use client";

import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([
    {
      id: "1",
      username: "admin",
      email: "admin@example.com",
      avatar: "/admin-avatar.png",
      bio: "Platform Administrator",
      role: "admin",
      isActive: true,
      createdAt: new Date("2024-01-01"),
      friends: [],
      blockedUsers: [],
      privacySettings: {
        profileVisible: true,
        postsVisible: true,
        friendsListVisible: true,
      },
    },
    {
      id: "2",
      username: "john_doe",
      email: "john@example.com",
      avatar: "/john-avatar.jpg",
      bio: "Tech enthusiast and developer",
      role: "user",
      isActive: true,
      createdAt: new Date("2024-01-15"),
      friends: ["3"],
      blockedUsers: [],
      privacySettings: {
        profileVisible: true,
        postsVisible: true,
        friendsListVisible: true,
      },
    },
    {
      id: "3",
      username: "jane_smith",
      email: "jane@example.com",
      avatar: "/jane-avatar.jpg",
      bio: "Designer and creative thinker",
      role: "user",
      isActive: true,
      createdAt: new Date("2024-01-20"),
      friends: ["2"],
      blockedUsers: [],
      privacySettings: {
        profileVisible: true,
        postsVisible: true,
        friendsListVisible: true,
      },
    },
  ]);

  const login = useCallback(
    async (email, password) => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const user = users.find((u) => u.email === email && u.isActive);
        if (!user) {
          throw new Error("Invalid credentials or account disabled");
        }

        setCurrentUser(user);
      } finally {
        setIsLoading(false);
      }
    },
    [users]
  );

  const signup = useCallback(
    async (username, email, password) => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (users.some((u) => u.email === email)) {
          throw new Error("Email already exists");
        }

        const newUser = {
          id: String(users.length + 1),
          username,
          email,
          role: "user",
          isActive: true,
          createdAt: new Date(),
          friends: [],
          blockedUsers: [],
          privacySettings: {
            profileVisible: true,
            postsVisible: true,
            friendsListVisible: true,
          },
        };

        setUsers([...users, newUser]);
        setCurrentUser(newUser);
      } finally {
        setIsLoading(false);
      }
    },
    [users]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const updateUser = useCallback(
    (userId, updates) => {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, ...updates } : u))
      );
      if (currentUser?.id === userId) {
        setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
      }
    },
    [currentUser]
  );

  const disableUser = useCallback(
    (userId) => {
      updateUser(userId, { isActive: false });
    },
    [updateUser]
  );

  const enableUser = useCallback(
    (userId) => {
      updateUser(userId, { isActive: true });
    },
    [updateUser]
  );

  const addUser = useCallback((user) => {
    setUsers((prev) => [...prev, user]);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
        disableUser,
        enableUser,
        addUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
