import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query"; // 1. Import useInfiniteQuery
import { api } from "../../shared/api";
import PostCard from "../post/PostCard";
import { CircularProgress } from "@mui/material";

export default function ProfilePost() {
  const { profileUser } = useOutletContext();
  const id = profileUser?.id;

  // --- 2. HÀM FETCH DATA CHUẨN CHO INFINITE QUERY ---
  const fetchPosts = async ({ pageParam = 1 }) => {
    // pageParam sẽ do React Query tự quản lý (mặc định là 1)
    const response = await api.get(`/users/${id}/posts`, {
      params: { page: pageParam }, // Axios tự ghép ?page=1
    });
    return response.data; // Trả về toàn bộ cục data (bao gồm data bài viết và next_page_url)
  };

  // --- 3. SỬ DỤNG USE INFINITE QUERY ---
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useInfiniteQuery({
    queryKey: ["profilePosts", id], // Key theo ID user để cache riêng từng người
    queryFn: fetchPosts,
    enabled: !!id,
    
    // Config quan trọng để giữ Cache khi chuyển tab
    staleTime: 5 * 60 * 1000, // 5 phút: Trong 5p này chuyển tab qua lại sẽ KHÔNG fetch lại
    
    // Logic xác định trang tiếp theo dựa trên response backend
    getNextPageParam: (lastPage) => {
      // lastPage là response.data của lần fetch trước
      if (!lastPage.next_page_url) return undefined; // Hết trang

      // Trích xuất số trang từ URL (vd: ...?page=2 => lấy số 2)
      try {
        const urlObj = new URL(lastPage.next_page_url);
        const params = new URLSearchParams(urlObj.search);
        return params.get("page"); // Trả về số trang tiếp theo cho pageParam
      } catch (e) {
        return undefined;
      }
    },
  });

  // --- 4. XỬ LÝ SCROLL (GIỮ NGUYÊN LOGIC CỦA BẠN NHƯNG GỌI HÀM CỦA QUERY) ---
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

      // Nếu cuộn gần đáy và còn trang tiếp theo + không đang load
      if (
        scrollTop + clientHeight >= scrollHeight - 50 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // --- 5. RENDER ---
  if (isLoading) {
    return (
        <div className="flex justify-center mt-10">
             <CircularProgress size={30} />
        </div>
    );
  }

  if (isError) return <div className="text-center mt-10 text-red-500">Lỗi tải bài viết</div>;

  // useInfiniteQuery trả về data dạng { pages: [Array1, Array2...] }
  // Cần flatMap để gộp tất cả các trang thành 1 mảng duy nhất để map
  const allPosts = data?.pages.flatMap((page) => page.data) || [];

  if (allPosts.length === 0) {
      return <div className="text-center mt-10 text-gray-500">Người dùng này chưa có bài viết nào.</div>
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-4">
      {allPosts.map((post, index) => (
        // Dùng key kết hợp id và index để tránh lỗi trùng lặp key hiếm gặp
        <div key={`${post.id}-${index}`} className="w-full max-w-xl">
          <PostCard postData={post} />
        </div>
      ))}
      
      {isFetchingNextPage && (
        <div className="py-4">
             <CircularProgress size={20} />
        </div>
      )}
    </div>
  );
}