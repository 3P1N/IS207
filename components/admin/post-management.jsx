"use client";

import { useState } from "react";
import { usePost } from "@/lib/post-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, EyeOff, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PostManagement() {
  const { posts, hidePost, showPost, deletePost } = usePost();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((p) => {
    const lowerQuery = searchQuery.toLowerCase();
    return (
      p.content.toLowerCase().includes(lowerQuery) ||
      p.username.toLowerCase().includes(lowerQuery)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Post List */}
      <div className="space-y-3">
        {filteredPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {post.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{post.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge variant={post.isVisible ? "outline" : "destructive"}>
                  {post.isVisible ? "Visible" : "Hidden"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-sm line-clamp-2">{post.content}</p>

              {post.image && (
                <img
                  src={post.image || "/placeholder.svg"}
                  alt="Post"
                  className="h-32 w-full rounded object-cover"
                />
              )}

              <div className="flex items-center justify-between pt-2">
                {/* Reaction & Comment Count */}
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>❤️ {post.reactions["❤️"] || 0}</span>
                  <span>👍 {post.reactions["👍"] || 0}</span>
                  <span>💬 {post.comments.length}</span>
                </div>

                {/* Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {post.isVisible ? (
                      <DropdownMenuItem onClick={() => hidePost(post.id)}>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Hide Post
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => showPost(post.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Show Post
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => deletePost(post.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
