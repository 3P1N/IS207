// src/components/Post/PostDetailPage.jsx
import PostCard from "./PostCard.jsx"; 
import CommentsSection from "./comment_session/CommentsSection.jsx";

// Dữ liệu Mẫu (Mock Data)
const mockPostData = {
    id: 1,
    author: {
        name: 'Jane Doe',
        profilePicture: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSWzWpYyimValDHrU0wCgqSZMKWDYU8ChH8pfdvew9nJNF0pqcAPDdvke8CjTVk6pilDEwELve5rBcHrGt4cy4YLovzVI3QQdCwtgmNyu3_QVPG5uwsnENHMw4-MWyp_3GXE_hVoBgpB1SHAlHhb-CIFJceglWPuuVM0cm7PbDPOJpahwmH28q811t0v6iFuSx4LVstl6SEcH2Tdkzh6OdoBtxPBonynWdZh_8bkXmfnr10ua2ZpsDw3ak2NsTg1OzTbs2nOzbLBA'
    },
    timeAgo: '2 hours ago',
    content: 'Exploring the beautiful landscapes today! The weather was perfect for a hike and I managed to get some great shots. Feeling so refreshed and connected with nature. #hiking #nature #photography',
    media: [
        { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLdli4-_jQ_1C21zD0av25z86jWRAVTTBJUH5Y4I8PhcvpOCDfDkfVDXJl-ENXtLuJLTL5X58KOVFwaJxoNHaAt4o3YsL2zQdgiisBKiV0OxbEPS2P3yl5Icg6z9P8_oCYqjTlRwiW_1h4EGXicMxIFnbBa9mEyayCa1Ryw_Sufx9_dKmbrC7gkuXvFbTzSunNR6slT_bdd52FSsjzKAlNC__ocvt9jbcbHZim-ERyBULeQyS3vprxv7vVjz7RJqEeTd6NoB0U4lw', alt: 'A scenic mountain view with a winding trail' },
        { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCe5KzN7CsRmYkcNaAEqfbNoGvMnQ-3W5F5XkKSB9cE6Nc9XazCMNYkN2vg62F7yx-yc1Xm_w-TP2eDcqeFcBJnvWMveGxriGtVnyoVs1sPZ__DGejWMSxMve6cxMJNPsQ6sbVVH9I4LzZXXs4BsC0QelpXN4VCN5bEMDdLRs6GxhXYkAJWEHZCy4HT4YFJhWTs7Xhc5U9dtkZtA-pzzIh97prlPCKJLn8zYDs8UeIwxYVXHhw26GOtXiFT4TvWE5q7TYeveRI4-Kc', alt: 'A close-up of wildflowers on the hiking path' },
    ],
    stats: {
        likes: '1.2K',
        comments: 345,
        shares: 128
    },
    isLiked: true,
};

const mockComments = [
    {
        id: 101,
        author: { name: 'John Smith', profilePicture: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF5FfRkDOQykRICGjnQlOtT12YTSwL1e-KzaS7Cs5_cmZG1lF_yGY8Jpyvxt6dXvmDm3pZgeugMS3mhl82np-XVfd5r4mP3Bwcl2KSyKCSb7mL6Pl3ser7xsvIKTI0xVgjEqhFmdMAzkSgUvQqH57vQYdA1BhJiOPedmRSZ5F7yfgzzEGQ-ATnpM4_y-U1ijUdGNdK9p0AuNTk5s2gajd4XlMGGw3M1zzUl2863sy6kwjX8BdMY30e7Tfd3GS6F30Cq-5FEnMcLIc' },
        text: 'Amazing shots! Where was this taken?',
        timeAgo: '1h',
        replies: [
            {
                id: 1011,
                author: { name: 'Jane Doe', profilePicture: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCt_mdG-5eP3nstimVw1Q3JYvYh_6M8PbkGt8yMwbO7QKpoFK2KNmS5a8Udqz7Rz12UtUW_JOyN28LWkRcG4VYeD5AHV__ZBeH6SdL0lNGyrJV3fQMq4lyfd0m19IYpaPh7g7ILeRRnGmCHjO-VuX7-wRl1tur5NZxx4AlHh2GiSTOcLjjPgz08uZqRiv8w12NtGimFVZ4I-5misBsI-p9YPWmfOlraaS3CVTooL0woXfWm976tFULGrJQwhHI2PilwX2dyQVAdq3M' },
                text: 'Thanks! This was at Glacier National Park.',
                timeAgo: '45m',
            }
        ]
    },
    {
        id: 102,
        author: { name: 'Emily White', profilePicture: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTwEBBg6XpYRy-gRpA7lK7JoFVtT8lT7eE0XtMrrPYVEV-OwUaUgTcfVrhC03VPe99XZ5ioiQAw9UEbawZzHDq3fPEVDxrlbmk5fplNVe6dBJFuyABYGXIf8pLbdgbAwvSSUiiarJTswG1D7nIP2re8jEncvHzK_e5ncCN-GpjQo3TQ5CcbJmL5KtGbqX677onneNZ6oNoDOsUtNUrz19W3qdifpGWdg9biaT8C0hXpi2Q7rwmggZ0COn_mcUY5c-5nfQ-xAt18c8' },
        text: 'Wow, I need to add this to my bucket list. The second photo is my favorite!',
        timeAgo: '30m',
        replies: []
    }
];

const currentUserId = { profilePicture: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsQyVvcUkG6UQQbp52w4SXG4CF1BaTetoc2-ffTzpmV7e1LwrBLAi1B5SA-PetE4WFhs_42U2eQ6nVuIvS2H287zbF2KITmmZD0CbwdjkYucG--S8h2PEW3rCgcPrrhreBITkDWngpZmRRBMDBDfZpRaLbYYFaTXh2i4j2Bh3fwnYlW9yZan0IE3uVEgZRFw3zLyt8v-OhRE5q-UWl8t_AnrBedtsiptOffEQD_xi_Lj1aVVMHo4ElDl5rBN7gF8A1UW__vQyjroM' }; // Giả định user hiện tại

// src/pages/post/PostDetailPage.jsx
// ... (các import và Mock Data giữ nguyên) ...

// ===============================================
// Đặt là TRUE, vì file này mô phỏng việc xem bài viết của mình
// (hoặc trang chi tiết cá nhân)
const IS_CURRENT_USER_POST = true; 
// ===============================================

// ... (các hàm handleEdit, handleReport giữ nguyên) ...

export default function PostDetailPage() {
    return (
        // ...
        <PostCard 
            post={mockPostData} 
            isOwner={IS_CURRENT_USER_POST} // <-- Luôn là TRUE
            onEdit={handleEdit}
            onReport={handleReport} // Report vẫn được truyền nhưng sẽ không được dùng do isOwner=true
            mockComments={mockComments} 
            currentUserProfile={currentUserId.profilePicture}
        />
        // ...
    );
}