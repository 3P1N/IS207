import React, { useContext, useState, useRef, useEffect } from 'react';
import './PostCreate.css';
import { IconButton, Tooltip, CircularProgress, Snackbar, Alert, Popover } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'; // UPDATE: Import Icon Emoji
import { AuthContext } from '../../router/AuthProvider';
import { api } from '../../shared/api';
import { useNavigate } from 'react-router-dom';
import AvatarUser from '../../shared/components/AvatarUser';
import EmojiPicker from 'emoji-picker-react'; // UPDATE: Import thư viện Emoji

export default function PostCreate() {

    const { userData, postsData, setPostsData } = useContext(AuthContext);
    const [postContent, setPostContent] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // State lưu trữ các đối tượng file đã chọn
    const [mediaFiles, setMediaFiles] = useState([]);
    const [loadingPost, setLoadingPost] = useState(false);
    const navigate = useNavigate();
    const [urlMedia, setUrlMedia] = useState([]);

    // UPDATE: State cho Emoji Picker
    const [anchorElEmoji, setAnchorElEmoji] = useState(null);
    const showEmojiPicker = Boolean(anchorElEmoji);

    // --- LOGIC EMOJI ---
    const handleEmojiClick = (event) => {
        setAnchorElEmoji(event.currentTarget);
    };

    const handleEmojiClose = () => {
        setAnchorElEmoji(null);
    };

    const onEmojiClick = (emojiObject) => {
        // Cộng dồn emoji vào nội dung text hiện tại
        setPostContent(prev => prev + emojiObject.emoji);
        // Không đóng picker để user có thể chọn nhiều icon
    };

    // --- LOGIC PASTE IMAGE (Dán ảnh từ clipboard) ---
    const handlePaste = (event) => {
        const items = event.clipboardData.items;
        let filesToProcess = [];

        // Duyệt qua các item trong clipboard
        for (let i = 0; i < items.length; i++) {
            // Nếu item là hình ảnh
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                filesToProcess.push(blob);
                // Ngăn không cho trình duyệt dán tên file hoặc dữ liệu rác vào textarea
                event.preventDefault(); 
            }
        }

        if (filesToProcess.length > 0) {
            const newMedia = filesToProcess.map(file => ({
                file: file,
                url: URL.createObjectURL(file),
                alt: "Pasted Image",
                type: 'image'
            }));

            setMediaFiles(prevFiles => [...prevFiles, ...newMedia]);
            setSnackbarMessage("Đã dán ảnh từ Clipboard!");
            setOpenSnackbar(true);
        }
    };

    // --- CÁC HÀM CŨ GIỮ NGUYÊN ---
    const uploadPost = async (urls) => {
        try {
            const response = await api.post(`/posts`, {
                content: postContent,
                media_url: urls,
            });
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
        setUrlMedia(urls);
        return urls;
    };

    const handleMediaChange = (event) => {
        const files = Array.from(event.target.files);
        const newMedia = files.map(file => ({
            file: file,
            url: URL.createObjectURL(file),
            alt: file.name,
            type: file.type.startsWith('image') ? 'image' : 'video'
        }));

        setMediaFiles(prevFiles => [...prevFiles, ...newMedia]);
        event.target.value = null;
    };

    const handleRemoveMedia = (indexToRemove) => {
        URL.revokeObjectURL(mediaFiles[indexToRemove].url);
        setMediaFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    const handlePost = async () => {
        if (!postContent.trim() && mediaFiles.length === 0) {
            alert("Vui lòng nhập nội dung hoặc chọn ảnh/video");
            return;
        }
        setLoadingPost(true);
        try {
            let uploadedUrls = [];
            if (mediaFiles.length > 0) {
                uploadedUrls = await uploadMultipleFilesParallel(mediaFiles);
            }
            const newPost = await uploadPost(uploadedUrls);
            setPostsData(prev => [newPost, ...postsData]);
            
            setPostContent('');
            setMediaFiles([]);
            setUrlMedia([]);
            setSnackbarMessage("Đăng bài thành công!");
            setOpenSnackbar(true);
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
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <main className="flex-grow w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-lg">
                    <div className="bg-white dark:bg-[#111821] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-[#1C1E21] dark:text-white">Create Post</h2>
                        </div>

                        <div className="flex items-start gap-4 pt-4">
                            <div>
                                <AvatarUser userData={userData} />
                                <p className="font-bold text-[#1C1E21] dark:text-white">{userData.name}</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <textarea
                                className="post-textarea w-full min-h-[120px] resize-none border-none outline-none focus:ring-0 bg-transparent p-0 text-base leading-relaxed caret-current cursor-text text-[#1C1E21] dark:text-white"
                                placeholder={`What's on your mind, ${userData.name}?`}
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                onPaste={handlePaste} // UPDATE: Gắn sự kiện Paste vào đây
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg mt-4">
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

                                {/* ICON CAMERA */}
                                <Tooltip title="Add Photo / Video">
                                    <IconButton
                                        component="label"
                                        htmlFor="media-upload"
                                        sx={{
                                            color: '#45bd62', // Màu xanh lá giống FB
                                            bgcolor: "rgba(69, 189, 98, 0.1)",
                                            "&:hover": { bgcolor: "rgba(69, 189, 98, 0.2)" }
                                        }}
                                    >
                                        <PhotoCamera />
                                    </IconButton>
                                </Tooltip>

                                {/* UPDATE: ICON EMOJI */}
                                <Tooltip title="Insert Emoji">
                                    <IconButton
                                        onClick={handleEmojiClick}
                                        sx={{
                                            color: '#f7b928', // Màu vàng
                                            bgcolor: "rgba(247, 185, 40, 0.1)",
                                            "&:hover": { bgcolor: "rgba(247, 185, 40, 0.2)" }
                                        }}
                                    >
                                        <EmojiEmotionsIcon />
                                    </IconButton>
                                </Tooltip>

                                {/* UPDATE: Popover chứa Emoji Picker */}
                                <Popover
                                    open={showEmojiPicker}
                                    anchorEl={anchorElEmoji}
                                    onClose={handleEmojiClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                >
                                    <EmojiPicker 
                                        onEmojiClick={onEmojiClick}
                                        width={350}
                                        height={400}
                                    />
                                </Popover>
                            </div>
                        </div>

                        {/* Media Preview */}
                        {mediaFiles.length > 0 && (
                            <div className={`mt-4 grid gap-2 ${mediaFiles.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                {mediaFiles.map((media, index) => (
                                    <div key={index} className="relative group w-full aspect-video bg-black rounded-lg overflow-hidden">
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