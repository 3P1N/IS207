import React, { useContext, useState } from 'react';
import './PostCreate.css';
import { IconButton, Tooltip, CircularProgress, Snackbar, Alert } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { AuthContext } from '../../router/AuthProvider';
import { api } from '../../shared/api';
import { Navigate, useNavigate } from 'react-router-dom';
import AvatarUser from '../../shared/components/AvatarUser';

export default function PostCreate() {

    const { userData, postsData, setPostsData } = useContext(AuthContext);
    const [postContent, setPostContent] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // State lưu trữ các đối tượng file đã chọn (bao gồm cả URL tạm thời cho preview)
    const [mediaFiles, setMediaFiles] = useState([]);
    const [loadingPost, setLoadingPost] = useState(false);
    const [idPost, setIdPost] = useState();
    const navigate = useNavigate();

    const [urlMedia, setUrlMedia] = useState([]);


    const uploadPost = async (urls) => {
        try {
            const response = await api.post(`/posts`,
                {
                    content: postContent,
                    media_url: urls,
                }
            );
            return response.data;
        } catch (e) {
            console.error(e);
            return e;
        }
    };


    const uploadMultipleFilesParallel = async (files) => {
        const uploadPromises = files.map(file => {
            const formData = new FormData();
            formData.append('file', file.file);
            formData.append('upload_preset', '3P1N-PMIT');
            formData.append('cloud_name', 'dezlofvj8');

            return fetch(import.meta.env.VITE_CLOUDINARY_UPLOAD_URL, {
                method: 'POST',
                body: formData,
            }).then(res => res.json());
        });

        const results = await Promise.all(uploadPromises);
        const urls = results.map(r => r.secure_url);
        setUrlMedia(urls);   // vẫn update state nếu muốn UI

        return urls;          // ✅ return để dùng ngay
    };



    // Hàm xử lý việc chọn file media
    const handleMediaChange = (event) => {
        const files = Array.from(event.target.files);

        // Tạo một mảng mới chứa đối tượng file và URL tạm thời (blob URL) để preview
        const newMedia = files.map(file => ({
            file: file, // Lưu trữ File object
            url: URL.createObjectURL(file), // Tạo URL tạm thời cho preview (quan trọng)
            alt: file.name,
            type: file.type.startsWith('image') ? 'image' : 'video' // Xác định loại file (để sau này phân biệt giữa img và video tag)
        }));

        setMediaFiles(prevFiles => [...prevFiles, ...newMedia]);
        // Xóa giá trị input để người dùng có thể chọn cùng một file lần nữa
        event.target.value = null;
    };

    // Hàm xử lý xóa một file media khỏi danh sách
    const handleRemoveMedia = (indexToRemove) => {
        // Cần thu hồi (revoke) URL tạm thời để tránh rò rỉ bộ nhớ
        URL.revokeObjectURL(mediaFiles[indexToRemove].url);

        setMediaFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    };
    // Hàm xử lý việc gửi bài viết (trong thực tế sẽ là API call)
    // Hàm xử lý việc gửi bài viết
    const handlePost = async () => {
        if (!postContent.trim() ) {
            alert("Vui lòng nhập nội dung");
            return;
        }

        setLoadingPost(true);

        try {
            let uploadedUrls = []; // Mặc định là mảng rỗng

            // CHỈ UPLOAD NẾU CÓ FILE TRONG LIST
            if (mediaFiles.length > 0) {
                uploadedUrls = await uploadMultipleFilesParallel(mediaFiles);
            }

            // Gửi post: nếu không có file, uploadedUrls sẽ gửi lên là []
            // Backend của bạn nên handle trường hợp media_url là mảng rỗng
            const newPost = await uploadPost(uploadedUrls);

            setPostsData(prev => [newPost, ...postsData]);

            // reset form
            setPostContent('');
            setMediaFiles([]);
            setUrlMedia([]);

            // hiện thông báo thành công
            setSnackbarMessage("Đăng bài thành công!");
            setOpenSnackbar(true);

            // chờ 1.5s rồi điều hướng về home
            setTimeout(() => {
                navigate("/home");
            }, 1500);

        } catch (err) {
            console.error(err);
            setSnackbarMessage("Đăng bài thất bại. Vui lòng thử lại.");
            setOpenSnackbar(true);
        } finally {
            setLoadingPost(false);
        }
    };



    // 3. LOGIC BIẾN

    // Nút Post chỉ được kích hoạt khi có nội dung hoặc có file media
    const isPostButtonDisabled = !postContent.trim() && mediaFiles.length === 0;

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
            {loadingPost && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30">
                    <CircularProgress color="primary" />
                </div>
            )}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <main className="flex-grow w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-lg">
                    {/* Hộp Modal/Card tạo bài viết */}
                    <div className="bg-white dark:bg-[#111821] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4">

                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-[#1C1E21] dark:text-white">Create Post</h2>
                            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-[#65676B] dark:text-gray-400">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* User Info & Visibility (Giữ nguyên) */}
                        <div className="flex items-start gap-4 pt-4">
                            <div>
                                <AvatarUser userData={userData} />
                                <p className="font-bold text-[#1C1E21] dark:text-white">{userData.name}</p>
                            </div>
                        </div>

                        {/* Text Area Input */}
                        <div className="mt-4">
                            <textarea
                                className="post-textarea w-full min-h-[120px] resize-none border-none outline-none focus:ring-0 bg-transparent p-0 text-base leading-relaxed caret-current cursor-text text-[#1C1E21] dark:text-white"
                                placeholder={`What's on your mind, ${userData.name}?`}
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                            />
                        </div>




                        {/* Add to Post Bar */}
                        <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg mt-4">
                            {/* <span className="text-sm font-medium text-[#1C1E21] dark:text-gray-300">Add to your post</span> */}
                            <div className="flex items-center gap-2">
                                {/* INPUT FILE ẨN */}
                                <input
                                    type="file"
                                    id="media-upload"
                                    multiple
                                    accept="image/*,video/*"
                                    style={{ display: "none" }}
                                    onChange={handleMediaChange}
                                />

                                {/* ICON BUTTON MUI */}
                                <Tooltip title="Add Photo / Video">
                                    <IconButton
                                        component="label"
                                        htmlFor="media-upload"
                                        color="primary"
                                        sx={{
                                            bgcolor: "rgba(25,118,210,0.08)",          // nhẹ đẹp
                                            "&:hover": { bgcolor: "rgba(25,118,210,0.15)" }
                                        }}
                                    >
                                        <PhotoCamera />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>

                        {/* Media Preview */}
                        {/* Media Preview */}
                        {mediaFiles.length > 0 && (
                            <div className={`mt-4 grid gap-2 ${mediaFiles.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                {mediaFiles.map((media, index) => (
                                    <div key={index} className="relative group w-full aspect-video bg-black rounded-lg overflow-hidden">

                                        {/* Logic hiển thị Ảnh hoặc Video */}
                                        {media.type === 'video' ? (
                                            <video
                                                src={media.url}
                                                className="w-full h-full object-cover"
                                                controls
                                            />
                                        ) : (
                                            <img
                                                src={media.url}
                                                alt={media.alt}
                                                className="w-full h-full object-cover"
                                            />
                                        )}

                                        {/* Nút xóa */}
                                        <button
                                            className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-10"
                                            onClick={() => handleRemoveMedia(index)}
                                        >
                                            <span className="material-symbols-outlined text-base block">close</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Post Button */}
                        <div className="mt-4 flex gap-2">
                            <button disabled={isPostButtonDisabled}
                                className={`
                                    flex-1 w-full max-w-[480px] items-center justify-center overflow-hidden 
                                    rounded-lg h-10 px-4 text-white text-sm font-bold
                                    ${isPostButtonDisabled
                                        ? "bg-gray-400 cursor-not-allowed opacity-70"
                                        : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                    }
                                    `}
                                onClick={handlePost}

                            >
                                <span className="truncate">Post</span>
                            </button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}