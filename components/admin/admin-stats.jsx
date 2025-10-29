"use client";

import { useAuth } from "@/lib/auth-context";
import { usePost } from "@/lib/post-context";
import { useChat } from "@/lib/chat-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, MessageSquare, AlertCircle } from "lucide-react";

export function AdminStats() {
  const { users } = useAuth();
  const { posts } = usePost();
  const { conversations } = useChat();

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const disabledUsers = users.filter((u) => !u.isActive).length;
  const totalPosts = posts.length;
  const hiddenPosts = posts.filter((p) => !p.isVisible).length;
  const totalConversations = conversations.length;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: Users,
      color: "text-green-500",
    },
    {
      title: "Disabled Users",
      value: disabledUsers,
      icon: AlertCircle,
      color: "text-destructive",
    },
    {
      title: "Total Posts",
      value: totalPosts,
      icon: FileText,
      color: "text-purple-500",
    },
    {
      title: "Hidden Posts",
      value: hiddenPosts,
      icon: AlertCircle,
      color: "text-orange-500",
    },
    {
      title: "Conversations",
      value: totalConversations,
      icon: MessageSquare,
      color: "text-cyan-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
