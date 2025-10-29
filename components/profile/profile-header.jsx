"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings } from "lucide-react";

export function ProfileHeader({ onOpenSettings }) {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <Card className="m-6 border-0 bg-gradient-to-r from-primary/20 to-accent/20">
      <CardContent className="pt-8">
        <div className="flex items-start justify-between">
          <div className="flex gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {currentUser.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{currentUser.username}</h1>
              <p className="text-muted-foreground">{currentUser.email}</p>
              <p className="text-sm text-foreground">
                {currentUser.bio || "No bio yet"}
              </p>

              <div className="flex gap-6 pt-2 text-sm">
                <div>
                  <span className="font-semibold text-primary">
                    {currentUser.friends.length}
                  </span>
                  <span className="text-muted-foreground"> Friends</span>
                </div>
                <div>
                  <span className="font-semibold text-primary">
                    {new Date(currentUser.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-muted-foreground"> Joined</span>
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={onOpenSettings}
            className="gap-2 bg-transparent"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
