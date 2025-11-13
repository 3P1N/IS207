// src/components/Post/PostHeader.jsx (ĐÃ CHỈNH SỬA)

// Thêm các props mới: isOwner, onEdit, onReport
export default function PostHeader({ author, timeAgo, profileUrl, isOwner, onEdit, onReport }) {
    
    // 1. Khởi tạo giá trị mặc định cho nút tùy chọn
    let icon = "..."; 
    let action = () => console.log("Default Action: No specific handler provided");
    let label = "More options";

    // 2. Logic điều kiện để hiển thị Edit hay Report
    if (isOwner) {
        icon = "edit"; // Icon cho chỉnh sửa
        action = onEdit;
        label = "Edit post";
    } else if (onReport) { // Chỉ hiện nút Report nếu không phải chủ sở hữu và có handler
        icon = "flag"; // Icon cho báo cáo (report/flag)
        action = onReport;
        label = "Report post";
    }
    
    return (
        <div className="flex items-center gap-3 bg-card-light dark:bg-card-dark px-4 pt-4 pb-2 justify-between">
            <div className="flex items-center gap-3">
                <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12"
                    data-alt={`${author}'s profile picture`}
                    style={{ backgroundImage: `url(${profileUrl})` }}
                />
                <div className="flex flex-col justify-center">
                    <p className="text-text-light-primary dark:text-text-dark-primary text-base font-semibold leading-normal line-clamp-1">
                        {author}
                    </p>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm font-normal leading-normal line-clamp-2">
                        {timeAgo}
                    </p>
                </div>
            </div>
            <div className="shrink-0">
                {/* Nút Tùy Chọn */}
                <button 
                    className="text-text-light-secondary dark:text-text-dark-secondary flex size-8 items-center justify-center rounded-full hover:bg-hover-light dark:hover:bg-hover-dark"
                    onClick={action} // Gắn action đã chọn (Edit hoặc Report)
                    aria-label={label}
                >
                    {/* BỎ COMMENT để Material Icon hiển thị */}
                    <span className="material-symbols-outlined">{icon}</span>
                </button>
            </div>
        </div>
    );
}