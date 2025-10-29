"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProfileTabs({ userPosts }) {
  const { currentUser, users } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");

  if (!currentUser) return null;

  const friends = users.filter((u) => currentUser.friends.includes(u.id));

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Posts ({userPosts.length})</TabsTrigger>
          <TabsTrigger value="friends">Friends ({friends.length})</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {userPosts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No posts yet. Start sharing!
              </CardContent>
            </Card>
          ) : (
            userPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="pb-3">
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p>{post.content}</p>
                  {post.image && (
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt="Post"
                      className="w-full rounded-lg"
                    />
                  )}
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>❤️ {post.reactions["❤️"] || 0}</span>
                    <span>👍 {post.reactions["👍"] || 0}</span>
                    <span>💬 {post.comments.length}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="friends" className="space-y-3">
          {friends.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No friends yet. Start connecting!
              </CardContent>
            </Card>
          ) : (
            friends.map((friend) => (
              <Card key={friend.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={friend.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {friend.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{friend.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {friend.bio}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h3 className="font-semibold">Bio</h3>
                <p className="text-muted-foreground">
                  {currentUser.bio || "No bio added"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-muted-foreground">{currentUser.email}</p>
              </div>
              <div>
                <h3 className="font-semibold">Member Since</h3>
                <p className="text-muted-foreground">
                  {new Date(currentUser.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Account Status</h3>
                <p
                  className={
                    currentUser.isActive ? "text-green-500" : "text-destructive"
                  }
                >
                  {currentUser.isActive ? "Active" : "Disabled"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
