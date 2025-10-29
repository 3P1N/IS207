"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { usePost } from "@/lib/post-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PostCard({ post }) {
  const { currentUser } = useAuth();
  const { addReaction, removeReaction, addComment, deletePost, deleteComment } =
    usePost();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [userReactions, setUserReactions] = useState({}); // key: `${postId}-${userId}` -> emoji

  if (!currentUser) return null;

  const handleReaction = (emoji) => {
    const key = `${post.id}-${currentUser.id}`;
    if (userReactions[key] === emoji) {
      // toggle off
      removeReaction(post.id, currentUser.id, emoji);
      setUserReactions((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } else {
      // switch emoji (remove old if exists)
      if (userReactions[key]) {
        removeReaction(post.id, currentUser.id, userReactions[key]);
      }
      addReaction(post.id, currentUser.id, emoji);
      setUserReactions((prev) => ({ ...prev, [key]: emoji }));
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addComment(post.id, {
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      content: commentText,
    });
    setCommentText("");
  };

  const isOwnPost = post.userId === currentUser.id;
  const isAdmin = currentUser.role === "admin";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.avatar || "/placeholder.svg"} />
            <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{post.username}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {(isOwnPost || isAdmin) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwnPost && (
                <DropdownMenuItem onClick={() => deletePost(post.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
              {isAdmin && !isOwnPost && (
                <DropdownMenuItem onClick={() => deletePost(post.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove (Admin)
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-foreground">{post.content}</p>

        {post.image && (
          <img
            src={post.image || "/placeholder.svg"}
            alt="Post content"
            className="w-full rounded-lg"
          />
        )}

        <div className="flex gap-2 border-t border-border pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction("❤️")}
            className={
              userReactions[`${post.id}-${currentUser.id}`] === "❤️"
                ? "text-destructive"
                : ""
            }
          >
            <Heart className="mr-1 h-4 w-4" />
            {post.reactions["❤️"] || 0}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction("👍")}
            className={
              userReactions[`${post.id}-${currentUser.id}`] === "👍"
                ? "text-primary"
                : ""
            }
          >
            👍 {post.reactions["👍"] || 0}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="mr-1 h-4 w-4" />
            {post.comments.length}
          </Button>
        </div>

        {showComments && (
          <div className="space-y-3 border-t border-border pt-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {comment.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="rounded-lg bg-muted p-2">
                    <p className="text-sm font-semibold">{comment.username}</p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  {(comment.userId === currentUser.id || isAdmin) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteComment(post.id, comment.id)}
                      className="mt-1 h-auto p-0 text-xs text-destructive"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {currentUser.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 gap-2">
                <Input
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddComment();
                  }}
                  className="text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
