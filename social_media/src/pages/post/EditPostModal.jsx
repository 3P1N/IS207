import React, { useState, useContext, useEffect } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    IconButton, 
    Tooltip, 
    CircularProgress, 
    Snackbar, 
    Alert, 
    Box, 
    Typography,
    useTheme 
} from "@mui/material";

import PhotoCamera from "@mui/icons-material/PhotoCamera";
import CloseIcon from '@mui/icons-material/Close'; 
import { AuthContext } from '../../router/AuthProvider';
import { api } from '../../shared/api';
import AvatarUser from '../../shared/components/AvatarUser';

export default function EditPostModal({ postData, postIndex, onClose }) {
    // 1. Thêm setPostsData vào useContext
    const { userData, setPostsData } = useContext(AuthContext);
    const theme = useTheme(); 

    const [postContent, setPostContent] = useState(postData.content || '');
    // Logic map media cũ
    const [mediaFiles, setMediaFiles] = useState(postData.media?.map(url => ({ 
        file: null, 
        url: url.media_url, 
        type: url.media_url.includes('.mp4') ? 'video' : 'image' // Check đơn giản đuôi file hoặc logic backend trả về type
    })) || []);
    
    const [urlMedia, setUrlMedia] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useEffect(() => {
        setPostContent(postData.content || '');
        setMediaFiles(postData.media?.map(url => ({ 
            file: null, 
            url: url.media_url, 
            type: 'image' 
        })) || []);
    }, [postData]);

    const handleClose = () => {
        if (onClose) onClose();
    };

    const uploadMultipleFilesParallel = async (files) => {
        const uploadPromises = files
            .filter(f => f.file) 
            .map(file => {
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
        const newUrls = results.map(r => r.secure_url);
        // Lọc lấy url của các ảnh cũ (không có file object)
        const existingUrls = files.filter(f => !f.file).map(f => f.url);
        const urls = [...existingUrls, ...newUrls]; // Ghép ảnh cũ + ảnh mới
        
        return urls;
    };

    const handleMediaChange = (event) => {
        const files = Array.from(event.target.files);
        const newMedia = files.map(file => ({
            file,
            url: URL.createObjectURL(file),
            alt: file.name,
            type: file.type.startsWith('image') ? 'image' : 'video'
        }));
        setMediaFiles(prev => [...prev, ...newMedia]);
        event.target.value = null;
    };

    const handleRemoveMedia = (index) => {
        if (mediaFiles[index].file) {
             URL.revokeObjectURL(mediaFiles[index].url);
        }
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!postContent.trim() && mediaFiles.length === 0) {
            setSnackbarMessage("Vui lòng nhập nội dung hoặc thêm ảnh/video.");
            setSnackbarOpen(true);
            return;
        }

        setLoading(true);

        try {
            const uploadedUrls = await uploadMultipleFilesParallel(mediaFiles);
            
            // 2. Gọi API update
            const response = await api.put(`/posts/${postData.id}`, { 
                content: postContent, 
                media_url: uploadedUrls 
            });
            
            // 3. Lấy dữ liệu post mới từ response (Backend trả về { message, post })
            const updatedPost = response.data.post;

            // 4. Cập nhật ngay lập tức vào Context để UI render lại
            setPostsData(prevPosts => {
                const newPosts = [...prevPosts];
                // Cập nhật đúng vị trí index đang sửa
                if (newPosts[postIndex]) {
                    newPosts[postIndex] = {
                        ...newPosts[postIndex], // Giữ các props cũ nếu cần
                        ...updatedPost,          // Ghi đè bằng data mới từ server
                        // Đảm bảo user object không bị mất nếu backend không trả về full user relation
                        user: newPosts[postIndex].user 
                    };
                }
                return newPosts;
            });

            setSnackbarMessage("Cập nhật bài viết thành công!");
            setSnackbarOpen(true);
            
            setTimeout(() => {
                 handleClose(); 
            }, 1000);
        } catch (err) {
            console.error(err);
            setSnackbarMessage("Cập nhật thất bại, vui lòng thử lại.");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const isSaveDisabled = !postContent.trim() && mediaFiles.length === 0;

    return (
        // ... (Giữ nguyên phần return UI như cũ)
        <>
            <Dialog 
                open={true} 
                onClose={handleClose} 
                fullWidth 
                maxWidth="sm"
                PaperProps={{
                    sx: { backgroundImage: 'none' } 
                }}
            >
                {/* ... UI code ... */}
                {loading && (
                    <Box sx={{
                        position: 'absolute', inset: 0, zIndex: 50,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        bgcolor: 'rgba(0, 0, 0, 0.3)' 
                    }}>
                        <CircularProgress color="primary" />
                    </Box>
                )}
                
                <DialogTitle>Edit Post</DialogTitle>
                
                <DialogContent dividers>
                   {/* ... UI code ... */}
                   {/* Header User */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <AvatarUser userData={userData} />
                        <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                            {userData.name}
                        </Typography>
                    </Box>

                    {/* Textarea */}
                    <Box
                        component="textarea"
                        placeholder={`What's on your mind, ${userData.name}?`}
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        sx={{
                            width: '100%',
                            minHeight: '120px',
                            resize: 'none',
                            border: 'none',
                            outline: 'none',
                            bgcolor: 'transparent',
                            color: 'text.primary', 
                            fontSize: '1rem',
                            fontFamily: 'inherit',
                            '&::placeholder': {
                                color: 'text.secondary',
                                opacity: 1
                            }
                        }}
                    />

                    {/* Media Upload & Preview */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <input
                            type="file"
                            id="media-upload-edit"
                            multiple
                            accept="image/*,video/*"
                            style={{ display: "none" }}
                            onChange={handleMediaChange}
                        />
                        <Tooltip title="Add Photo / Video">
                            <IconButton component="label" htmlFor="media-upload-edit" color="primary">
                                <PhotoCamera />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {mediaFiles.length > 0 && (
                        <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                            {mediaFiles.map((media, index) => (
                                <Box key={index} sx={{ position: 'relative', '&:hover .delete-btn': { opacity: 1 } }}>
                                    {/* Handle Video Preview if needed */}
                                    {media.type === 'video' ? (
                                        <video 
                                            src={media.url} 
                                            className="w-full aspect-video object-cover rounded-lg border border-divider"
                                            controls={false} // Preview thumbnail thôi
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                width: '100%',
                                                aspectRatio: '16/9',
                                                borderRadius: 2,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                backgroundImage: `url("${media.url}")`,
                                                border: '1px solid',
                                                borderColor: 'divider'
                                            }}
                                        />
                                    )}
                                    
                                    <IconButton
                                        className="delete-btn"
                                        size="small"
                                        onClick={() => handleRemoveMedia(index)}
                                        sx={{
                                            position: 'absolute', top: 8, right: 8,
                                            bgcolor: 'rgba(0,0,0,0.6)', color: 'white',
                                            opacity: 0, transition: 'opacity 0.2s',
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                                        }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                    <Button onClick={handleClose} color="inherit">Cancel</Button>
                    <Button
                        variant="contained"
                        disabled={isSaveDisabled}
                        onClick={handleSave}
                        color="primary"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarMessage.includes("thất bại") ? "error" : "success"}
                    sx={{ width: "100%" }}
                    variant="filled"
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}