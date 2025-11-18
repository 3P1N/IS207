import React, { useState, useContext, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Tooltip, CircularProgress, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { AuthContext } from '../../router/AuthProvider';
import { api } from '../../shared/api';
import AvatarUser from '../../shared/components/AvatarUser';

export default function EditPostModal({ postData }) {
    const { userData, token } = useContext(AuthContext);

    const [open, setOpen] = useState(false);
    const [postContent, setPostContent] = useState(postData.content || '');
    const [mediaFiles, setMediaFiles] = useState(postData.media?.map(url => ({ file: null, url, type: 'image' })) || []);
    const [urlMedia, setUrlMedia] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useEffect(() => {
        setPostContent(postData.content || '');
        setMediaFiles(postData.media?.map(url => ({ file: null, url: url.media_url, type: 'image' })) || []);
    }, [postData]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const uploadMultipleFilesParallel = async (files) => {
        const uploadPromises = files
            .filter(f => f.file) // chỉ upload file mới
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
        const existingUrls = files.filter(f => !f.file).map(f => f.url);
        const urls = [...existingUrls, ...newUrls];
        setUrlMedia(urls);
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
        URL.revokeObjectURL(mediaFiles[index].url);
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!postContent.trim() && mediaFiles.length === 0) {
            alert("Vui lòng nhập nội dung hoặc thêm ảnh/video.");
            return;
        }

        setLoading(true);

        try {
            
            
            const uploadedUrls = await uploadMultipleFilesParallel(mediaFiles);
            console.log(uploadedUrls);
            await api.put(`/posts/${postData.id}`, { content: postContent, media_url: uploadedUrls }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSnackbarMessage("Cập nhật bài viết thành công!");
            setSnackbarOpen(true);
            setOpen(false);
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
        <>
            <Button onClick={handleOpen} startIcon={<EditIcon />}>Edit</Button>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                {loading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30">
                        <CircularProgress color="primary" />
                    </div>
                )}
                <DialogTitle>Edit Post</DialogTitle>
                <DialogContent dividers>
                    <div className="flex items-start gap-4 mb-4">
                        <AvatarUser userData={userData} />
                        <p className="font-bold text-[#1C1E21] dark:text-white">{userData.name}</p>
                    </div>
                    <textarea
                        className="post-textarea w-full min-h-[120px] resize-none border-none outline-none focus:ring-0 bg-transparent p-0 text-base leading-relaxed caret-current cursor-text text-[#1C1E21] dark:text-white"
                        placeholder={`What's on your mind, ${userData.name}?`}
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                    />
                    <div className="flex items-center gap-2 mt-2">
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
                    </div>
                    {mediaFiles.length > 0 && (
                        <div className="mt-4 grid gap-2 grid-cols-2">
                            {mediaFiles.map((media, index) => (
                                <div key={index} className="relative group">
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                                        style={{ backgroundImage: `url("${media.url}")` }}
                                    />
                                    <button
                                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleRemoveMedia(index)}
                                    >
                                        <span className="material-symbols-outlined text-base">close</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
                <DialogActions className="flex justify-between p-3">
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        disabled={isSaveDisabled}
                        onClick={handleSave}
                        className={`${isSaveDisabled ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
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
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}
