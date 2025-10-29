"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";

export function PrivacySettings({ onClose }) {
  const { currentUser, updateUser } = useAuth();
  const [settings, setSettings] = useState(
    currentUser?.privacySettings || {
      profileVisible: true,
      postsVisible: true,
      friendsListVisible: true,
    }
  );

  if (!currentUser) return null;

  const handleToggle = (key) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };
    setSettings(newSettings);
    updateUser(currentUser.id, {
      privacySettings: newSettings,
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onClose} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Privacy Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Visibility</CardTitle>
          <CardDescription>
            Control who can see your profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingItem
            title="Profile Visible"
            description="Allow others to view your profile"
            checked={settings.profileVisible}
            onChange={() => handleToggle("profileVisible")}
          />
          <SettingItem
            title="Posts Visible"
            description="Allow others to see your posts"
            checked={settings.postsVisible}
            onChange={() => handleToggle("postsVisible")}
          />
          <SettingItem
            title="Friends List Visible"
            description="Allow others to see your friends list"
            checked={settings.friendsListVisible}
            onChange={() => handleToggle("friendsListVisible")}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              Two-factor authentication and other security features coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingItem({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-4">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
