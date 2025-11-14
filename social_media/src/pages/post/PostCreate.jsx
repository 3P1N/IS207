import React, { useState } from 'react'; 

export default function PostCreate() {
    
    // 1. STATE MANAGEMENT
    const [postContent, setPostContent] = useState('');
    // State lưu trữ các đối tượng file đã chọn (bao gồm cả URL tạm thời cho preview)
    const [mediaFiles, setMediaFiles] = useState([]); 
    
    // Dữ liệu mẫu cứng cho người dùng hiện tại
    const currentUser = {
        name: "Alex Miller",
        profilePicture: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0ZZ_as3C9WDHTLF7lkX0AFwM12P7yjtCFjDygFT_780bEAJfDN2TRPO1J_PNENKBPWv4rMMH1UEZCvwEM6sga-w8sz2vjmlv23tagyYScuGLfadO3vsB7X9M6HHxHKw_6vS4h8SC12WvHDyhq6lUIzTKXmUI44JUUtoaPBJFmNXHgR9lAZ8kUf9Z_HOxJ3BPWaij0pr-xEADXPRWRYw_aaa2Tvk2vYsfbemkwDWsMHaYcpJ9KJs4ZlM0qcIFZQ4gvhVwRlOVi5Ko"
    };

    // 2. HANDLER FUNCTIONS
    
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
    const handlePost = () => {
        if (!postContent.trim() && mediaFiles.length === 0) {
            alert("Vui lòng nhập nội dung hoặc thêm ảnh/video.");
            return;
        }
        
        // *******************************************************************
        // LOGIC GỬI LÊN BACKEND (LARAVEL):
        // Bạn sẽ sử dụng 'mediaFiles.map(m => m.file)' để lấy các File objects
        // và gửi chúng cùng với postContent qua API sử dụng FormData.
        // *******************************************************************

        console.log("Đang gửi bài viết...");
        // Reset form sau khi gửi
        setPostContent('');
        setMediaFiles([]); 
        alert("Bài viết đã được gửi thành công (Mock Post)!");
    };

    // 3. LOGIC BIẾN

    // Nút Post chỉ được kích hoạt khi có nội dung hoặc có file media
    const isPostButtonDisabled = !postContent.trim() && mediaFiles.length === 0;

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
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
                            <div 
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0" 
                                data-alt="User avatar" 
                                style={{ backgroundImage: `url("${currentUser.profilePicture}")` }}
                            />
                            <div className="flex-grow">
                                <p className="font-bold text-[#1C1E21] dark:text-white">{currentUser.name}</p>
                                <button className="flex items-center gap-1 text-sm text-[#65676B] dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-md">
                                    <span className="material-symbols-outlined text-base">public</span>
                                    <span>Public</span>
                                    <span className="material-symbols-outlined text-base">arrow_drop_down</span>
                                </button>
                            </div>
                        </div>
                        
                        {/* Text Area Input */}
                        <div className="mt-4">
                            <textarea 
                                className="form-input w-full min-h-[120px] resize-none border-none focus:ring-0 text-xl placeholder:text-[#65676B] dark:placeholder:text-gray-400 bg-transparent p-0" 
                                placeholder={`What's on your mind, ${currentUser.name}?`}
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                            />
                        </div>
                        
                        {/* Add to Post Bar */}
                        <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg mt-4">
                            <span className="text-sm font-medium text-[#1C1E21] dark:text-gray-300">Add to your post</span>
                            <div className="flex items-center gap-2">
                                
                                {/* INPUT FILE ẨN */}
                                <input 
                                    type="file" 
                                    id="media-upload" 
                                    multiple 
                                    accept="image/*,video/*" 
                                    className="hidden" 
                                    onChange={handleMediaChange}
                                />
                                
                                {/* NÚT KÍCH HOẠT INPUT FILE (Dùng <label> để liên kết với <input>) */}
                                <label 
                                    htmlFor="media-upload"
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-green-500 cursor-pointer" 
                                    title="Add Photo/Video"
                                >
                                    <span className="material-symbols-outlined">thêm ảnh</span>
                                </label>

                             
                            </div>
                        </div>
                        
                        {/* Media Preview */}
                        {mediaFiles.length > 0 && (
                            <div className={`mt-4 grid gap-2 ${mediaFiles.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                {mediaFiles.map((media, index) => (
                                    <div key={index} className="relative group">
                                        {/* Hiển thị dựa trên loại file (Chỉ xử lý ảnh ở đây, video cần tag <video>) */}
                                        <div 
                                            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg" 
                                            data-alt={media.alt} 
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
                        
                        {/* Post Button */}
                        <div className="mt-4 flex gap-2">
                            <button 
                                className={`flex-1 w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-white text-sm font-bold ${
                                    isPostButtonDisabled 
                                        ? 'bg-primary hover:bg-primary/90'
                                        : 'bg-gray-400 cursor-not-allowed'
                                        
                                }`}
                                onClick={handlePost}
                                disabled={isPostButtonDisabled}
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