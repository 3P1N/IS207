import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/lib/auth-context";
import { PostProvider } from "@/lib/post-context";
import { ChatProvider } from "@/lib/chat-context";
import { FriendProvider } from "@/lib/friend-context";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: "SocialHub - Connect with Friends",
  description:
    "A modern social media platform to connect, share, and communicate",
  generator: "v0.app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <PostProvider>
            <ChatProvider>
              <FriendProvider>{children}</FriendProvider>
            </ChatProvider>
          </PostProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
