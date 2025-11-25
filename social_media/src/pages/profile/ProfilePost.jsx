// import './profile.css'
import { useContext, useEffect, useState } from "react";
import { api } from "../../shared/api";
import { AuthContext } from "../../router/AuthProvider";
import PostCard from '../post/PostCard';
const MOCK_POSTS = [{
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
},
];

export default function ProfilePost() {
    const [posts, setPosts] = useState([]);
    
    const [nextPageUrl, setNextPageUrl] = useState(null);
    
    const [loading, setLoading] = useState(false);
    
    const {  } = useContext(AuthContext);

    const getPostData = async (url = "/posts") => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await api.get(url);

            console.log(response.data);

            // response.data = paginate object
    
            // response.data.data = array posts
            setPosts((prev) => {
                const newPosts = response.data.data.filter(
                    (p) => !prev.some((old) => old.id === p.id)
                );
                return [...prev, ...newPosts];
            });


            // update next_page_url
            setNextPageUrl(response.data.next_page_url);

        } catch (err) {
            console.log("lỗi khi tải bài viết: ", err);
        } finally {
            setLoading(false);
        }
    };

    // load trang đầu tiên
    useEffect(() => {
        getPostData();
    }, []); // 👈 thêm dependency rỗng để tránh gọi vô hạn


    // scroll listener để auto load
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 50 >=
                document.documentElement.scrollHeight
            ) {
                if (nextPageUrl && !loading) {
                    getPostData(nextPageUrl);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [nextPageUrl, loading]);
  return (
    <div className="space-y-6">
      {/* Header + filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Bài viết</h2>
          <p className="text-sm text-gray-500">
            Danh sách bài đăng gần đây của người dùng
          </p>
        </div>

        <div className="inline-flex overflow-hidden rounded-full border border-gray-200 bg-gray-50 text-xs font-medium text-gray-600">
          <button className="px-4 py-1.5 bg-white text-gray-900">
            Tất cả
          </button>
          <button className="px-4 py-1.5 hover:bg-white/70">Ảnh</button>
          <button className="px-4 py-1.5 hover:bg-white/70">Video</button>
        </div>
      </div>

      {/* Danh sách bài viết */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
