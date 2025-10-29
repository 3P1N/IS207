"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Home, User, MessageSquare, Users, LogOut, Shield } from "lucide-react";

export function Sidebar({ currentPage, onPageChange }) {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  return (
    <aside className="w-64 border-r border-border bg-card p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">SocialHub</h1>
        <p className="text-sm text-muted-foreground">
          Welcome, {currentUser.username}
        </p>
      </div>

      <nav className="space-y-2">
        <NavButton
          icon={<Home className="h-5 w-5" />}
          label="Feed"
          active={currentPage === "feed"}
          onClick={() => onPageChange("feed")}
        />
        <NavButton
          icon={<User className="h-5 w-5" />}
          label="Profile"
          active={currentPage === "profile"}
          onClick={() => onPageChange("profile")}
        />
        <NavButton
          icon={<MessageSquare className="h-5 w-5" />}
          label="Messages"
          active={currentPage === "chat"}
          onClick={() => onPageChange("chat")}
        />
        <NavButton
          icon={<Users className="h-5 w-5" />}
          label="Friends"
          active={currentPage === "friends"}
          onClick={() => onPageChange("friends")}
        />

        {currentUser.role === "admin" && (
          <NavButton
            icon={<Shield className="h-5 w-5" />}
            label="Admin Panel"
            active={currentPage === "admin"}
            onClick={() => onPageChange("admin")}
          />
        )}
      </nav>

      <div className="mt-8 border-t border-border pt-4">
        <Button
          variant="outline"
          className="w-full justify-start bg-transparent"
          onClick={logout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-muted"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
