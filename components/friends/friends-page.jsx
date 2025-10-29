"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendsTab } from "./friends-tab";
import { RequestsTab } from "./requests-tab";
import { DiscoverTab } from "./discover-tab";

export function FriendsPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("friends");

  if (!currentUser) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Friends</h1>
        <p className="text-muted-foreground">
          Manage your connections and discover new friends
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="friends">My Friends</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>

        <TabsContent value="friends">
          <FriendsTab />
        </TabsContent>

        <TabsContent value="requests">
          <RequestsTab />
        </TabsContent>

        <TabsContent value="discover">
          <DiscoverTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
