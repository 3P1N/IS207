import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ExplorePage from "../pages/explore/ExplorePage";
import HomePage from "../pages/home/HomePage";

import LoginForm from "../pages/auth/login-form";
import SignupForm from "../pages/auth/signup-form";
import ProfileLayout from "../pages/profile/ProfileLayout";
import ProfileAbout from "../pages/profile/ProfileAbout";
import ProfilePost from "../pages/profile/ProfilePost";
import ProfileFriend from "../pages/profile/ProfileFriend";
import PostDetailPage from "../pages/post/PostDetailPage";
import ProfileSetting from "../pages/profile/ProfileSetting";
import MessageLayout from "../pages/message/MessageLayout";
import ThreadPage from "../pages/message/ThreadPage";
import AdminLayout from "../pages/admin/AdminLayout";
import UsersAdminPage from "../pages/admin/UsersAdminPage";
import PostsAdminPage from "../pages/admin/PostsAdminPage";
import NotFoundPage from "../pages/not-found/NotFoundPage";
import AuthLayout from "../layouts/AuthLayout";
import AuthProvider from "./AuthProvider";
import ProtectedRoute from "./ProtectedRoute";
import GuestRouter from "./GuestRouter";
import SearchResultPage from "../pages/search/SearchResultPage";
import RoleRoute from "./RoleRoute";
import PostCreate from "../pages/post/PostCreate";
import ProfileSuggest from "../pages/profile/ProfileSuggest";
import ResetPasswordForm from "../pages/auth/reset-password-form";
import ChangePasswordForm from "../pages/changepassword/ChangePasswordForm";
import VideoCallProvider from "./VideoCallProvider";
// import NotFoundPage from "@/pages/not-found/NotFoundPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <AuthProvider>
                {/* <VideoCallProvider> */}
                    <Routes>

                        <Route element={<GuestRouter />}>
                            {/* Đăng nhập, Đăng ký */}
                            <Route element={<AuthLayout />} >
                                <Route path="login" element={<LoginForm />} />
                                <Route path="signup" element={<SignupForm />} />
                                <Route path="reset-password" element={<ResetPasswordForm />} />

                            </Route>
                        </Route>
                        <Route element={<ProtectedRoute />}>
                            {/* Layout route */}

                            <Route element={<MainLayout />}>
                                <Route index element={<HomePage />} />
                                <Route path="explore" element={<ExplorePage />} />
                                <Route path="search" element={<SearchResultPage />} />
                                <Route path="change-password" element={<ChangePasswordForm />} />

                                {/* Profile có tab */}
                                <Route path="profile/:id" element={<ProfileLayout />}>
                                    <Route index element={<ProfilePost />} />
                                    <Route path="ProfileAbout" element={<ProfileAbout />} />
                                    <Route path="ProfileFriend" element={<ProfileFriend />} />
                                    <Route path="ProfileSuggest" element={<ProfileSuggest />} />
                                </Route>
                                {/* Setting */}
                                <Route path="setting" element={<ProfileSetting />} />
                                <Route path="create-post" element={<PostCreate />} />

                                {/* Post detail */}
                                <Route path="post/:postId" element={<PostDetailPage />} />

                                {/* Message và MessageThread (ô trò chuyện) */}
                                <Route path="message" element={<MessageLayout />}>
                                    {/* <Route index element={<ThreadList />} /> */}
                                    <Route path=":threadId" element={<ThreadPage />} />
                                </Route>

                                {/* Phần riêng quản lý của Admin */}
                                <Route element={<RoleRoute roles={['admin']} />}>
                                    <Route path="admin" element={<AdminLayout />}>
                                        <Route index element={<Navigate to="users" replace />} />
                                        <Route path="users" element={<UsersAdminPage />} />
                                        <Route path="posts" element={<PostsAdminPage />} />
                                    </Route>
                                </Route>

                            </Route>
                        </Route>
                        {/* Redirect ví dụ */}
                        <Route path="/home" element={<Navigate to="/" replace />} />

                        {/* 404 */}
                        <Route path="*" element={<NotFoundPage />} />

                    </Routes>
                {/* </VideoCallProvider> */}
            </AuthProvider>
        </BrowserRouter>
    );
}
