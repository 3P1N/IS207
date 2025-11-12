import PostDetailPage from "../post/PostDetailPage.jsx";
// Nếu bạn đặt HomePage ở thư mục gốc /src, và PostDetailPage ở /src/components/Post/PostDetailPage, 
// thì đường dẫn import cần được điều chỉnh cho phù hợp.
// Ví dụ: import PostDetailPage from './components/Post/PostDetailPage';

export default function HomePage() {
    return (
        // Khung chính của trang Home, có thể thêm Header hoặc Footer ở đây
        <div className="flex flex-col items-center w-full min-h-screen bg-background-light dark:bg-background-dark">
            
            {/* Tiêu đề trang hoặc Navigation Bar */}
            <header className="w-full max-w-2xl px-4 py-6 text-center">
                <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">
                    Trang Chủ (Feed)
                </h1>
                <p className="text-text-light-secondary dark:text-text-dark-secondary">
                    Hiển thị chi tiết bài đăng mẫu
                </p>
            </header>

            {/* Vùng hiển thị PostDetailPage */}
            <main className="w-full max-w-2xl">
                {/* Chúng ta sẽ render PostDetailPage ở đây. 
                  Trong một ứng dụng thực tế, bạn sẽ lặp (map) qua một mảng bài đăng.
                */}
                <PostDetailPage /> 
                
                {/* Bạn có thể render thêm các bài đăng khác nếu muốn, 
                  nhưng hiện tại PostDetailPage chỉ là một bài đăng duy nhất.
                */}
            </main>
        </div>
    );
}