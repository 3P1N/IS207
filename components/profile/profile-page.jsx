"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { usePost } from "@/lib/post-context";
import { ProfileHeader } from "./profile-header";
import { ProfileTabs } from "./profile-tabs";
import { PrivacySettings } from "./privacy-settings";

export function ProfilePage() {
  const { currentUser } = useAuth();
  const { posts } = usePost();
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);

  if (!currentUser) return null;

  const userPosts = posts.filter((p) => p.userId === currentUser.id);

  return (
    <div className="min-h-screen bg-background">
      {showPrivacySettings ? (
        <PrivacySettings onClose={() => setShowPrivacySettings(false)} />
      ) : (
        <>
          <ProfileHeader onOpenSettings={() => setShowPrivacySettings(true)} />
          <ProfileTabs userPosts={userPosts} />
        </>
      )}
    </div>
  );
}
