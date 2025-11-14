import { IconButton, } from "@mui/material";

export default function PostHeader({ author, timeAgo, profileUrl, isOwner, onEdit, onReport }) {

    let icon = (
        <IconButton size="small">
            <span className="material-symbols-outlined">report</span>
        </IconButton>
    );

    let action = () => console.log("Default Action: No specific handler provided");
    let label = "More options";

    if (isOwner) {
        icon = (
            <IconButton size="small">
                <span className="material-symbols-outlined">
                    edit</span>
                    {/* <IconButton></IconButton> */}
            </IconButton>
        );
        action = onEdit;
        label = "Edit post";
    } else if (onReport) {
        icon = (
            <IconButton size="small">
                <span className="material-symbols-outlined">flag</span>
            </IconButton>
        );
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

            <div className="shrink-0" onClick={action} aria-label={label}>
                {icon}
            </div>
        </div>
    );
}
