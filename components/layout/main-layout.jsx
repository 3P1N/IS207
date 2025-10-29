"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Sidebar } from "./sidebar";
import { Feed } from "@/components/feed/feed";
import { ProfilePage } from "@/components/profile/profile-page";
import { ChatPage } from "@/components/chat/chat-page";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { FriendsPage } from "@/components/friends/friends-page";

export function MainLayout() {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState("feed");

  if (!currentUser) return null;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {currentPage === "feed" && <Feed />}
        {currentPage === "profile" && <ProfilePage />}
        {currentPage === "chat" && <ChatPage />}
        {currentPage === "friends" && <FriendsPage />}
        {currentPage === "admin" && currentUser.role === "admin" && (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
}
