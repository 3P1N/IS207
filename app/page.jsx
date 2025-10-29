"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AuthPage } from "@/components/auth/auth-page";
import { MainLayout } from "@/components/layout/main-layout";

export default function Home() {
  const { currentUser } = useAuth();
  const [authSuccess, setAuthSuccess] = useState(false);

  if (!currentUser) {
    return <AuthPage onAuthSuccess={() => setAuthSuccess(!authSuccess)} />;
  }

  return <MainLayout />;
}
