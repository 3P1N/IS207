"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { usePost } from "@/lib/post-context";
import { CreatePostCard } from "./create-post-card";
import { PostCard } from "./post-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function Feed() {
  const { currentUser } = useAuth();
  const { posts, searchPosts } = usePost();
  const [searchQuery, setSearchQuery] = useState("");

  const displayPosts = searchQuery ? searchPosts(searchQuery) : posts;
  const visiblePosts = displayPosts.filter((p) => p.isVisible);

  if (!currentUser) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Create post area */}
      <CreatePostCard />

      {/* Feed posts */}
      <div className="space-y-4">
        {visiblePosts.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              No posts found. Start creating!
            </p>
          </div>
        ) : (
          visiblePosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
