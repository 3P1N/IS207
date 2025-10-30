import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ExplorePage from "../pages/explore/ExplorePage";
import HomePage from "../pages/home/HomePage";
import MessagePage from "../pages/message/MessagePage";
import ProfilePage from "../pages/profile/ProfilePage";
import LoginForm from "../pages/auth/login-form";
import SignupForm from "../pages/auth/signup-form";
// import NotFoundPage from "@/pages/not-found/NotFoundPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Đăng nhập, Đăng ký */}
                <Route path="login" element={<LoginForm />} />
                <Route path="signup" element={<SignupForm />} />

                {/* Layout route */}
                <Route element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="explore" element={<ExplorePage />} />



                    {/* Profile có tab */}
                    <Route path="profile/:id" element={<ProfileLayout />}>
                        <Route index element={<ProfilePost />} />
                        <Route path="about" element={<ProfileAbout />} />
                        <Route path="friend" element={<ProfileFriend />} />
                        <Route path="setting" element={<ProfileSetting />} />
                    </Route>

                    {/* Post detail */}
                    <Route path="post/:postId" element={<PostDetailPage />} />

                    {/* Message và MessageThread (ô trò chuyện) */}
                    <Route path="message" element={<MessageLayout />}>
                        <Route index element={<ThreadList />} />
                        <Route path=":threadId" element={<ThreadPage />} />
                    </Route>

                    {/* Phần riêng quản lý của Admin */}
                    <Route path="admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="users" replace />} />
                        <Route path="users" element={<UsersAdminPage />} />
                        <Route path="posts" element={<PostsAdminPage />} />
                    </Route>


                </Route>

                {/* Redirect ví dụ */}
                <Route path="/home" element={<Navigate to="/" replace />} />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />

            </Routes>
        </BrowserRouter>
    );
}
