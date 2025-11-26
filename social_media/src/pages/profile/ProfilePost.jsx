// src/pages/profile/ProfilePost.jsx
import { api } from "../../shared/api";
import PostCard from "../post/PostCard";
import { useOutletContext, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../router/AuthProvider";

export default function ProfilePost() {
  
      // const [posts, setPosts] = useState([]);
      const [nextPageUrl, setNextPageUrl] = useState(null);
      const [loading, setLoading] = useState(false);
      const { profileUser } = useOutletContext();
      const id = profileUser?.id;
      const [postsData,setPostsData]=useState([]);
      const getPostData = async (url = `users/${id}/posts`) => {
          if (loading) return;
  
          setLoading(true);
  
          try {
              const response = await api.get(url);
  
              console.log(response.data);
              setPostsData(response.data.data);
  
  
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
          <div className="mt-6 flex flex-col items-center gap-4">
              {postsData.map((post, index) => (
                  <div key={post.id} className="w-full max-w-xl">
                      <PostCard postData={post} index = {index} />
                  </div>
              ))}
  
              {loading && <div>Đang tải thêm...</div>}
          </div>
      );
  
}
