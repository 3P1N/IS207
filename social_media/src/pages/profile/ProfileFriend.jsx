import "./profile.css";
import { useState } from "react";
import { useQuery , useQueryClient } from "@tanstack/react-query"; // Import useQuery
import { api } from "../../shared/api";
import { useOutletContext } from "react-router-dom";
import FriendCard from "./FriendCard";

export default function ProfileFriend() {
  const [activeTab, setActiveTab] = useState("friends"); // "friends" | "requests"
  
  // Lấy context từ Outlet
  const { profileUser, isOwnProfile } = useOutletContext();
  const id = profileUser?.id;
  const queryClient = useQueryClient();
  // --- USE QUERY: LẤY DANH SÁCH BẠN BÈ ---
  const { 
    data: friends = [], // Mặc định là mảng rỗng nếu chưa có dữ liệu
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ["friends", id], // Key định danh cho query này
    queryFn: async () => {
      const response = await api.get(`/friendship/${id}`);
      // Trả về mảng friends trực tiếp để biến 'data' hứng lấy
      return response.data.friends || [];
    },
    enabled: !!id, // Chỉ chạy query khi có id
    staleTime: 1000 * 60 * 5, // (Tuỳ chọn) Data được coi là mới trong 5 phút
  });
  // --- LỌC DANH SÁCH (Client-side) ---
  // Lọc dựa trên biến 'friends' lấy từ useQuery
  const friendList = friends.filter(
    (f) => f.pivot?.status === "accepted"
  );

  const requestList = friends.filter(
    (f) => f.pivot?.status === "pending"
  );
  const updateFriendInCache = (friendId, next) => {
    // next: { status, friendshipId }
    queryClient.setQueryData(["friends", id], (old = []) => {
      return old.map((f) => {
        if (f.id !== friendId) return f;

        return {
          ...f,
          pivot: {
            ...(f.pivot || {}),
            status: next.status,                // cập nhật status
            id: next.friendshipId ?? f.pivot?.id, // cập nhật id friendship nếu có
          },
        };
      });
    });
  }
  return (
    <div className="space-y-6">
      {/* Header + search + switch tab */}
      <div className="friends-header">
        <div>
          <h2 className="friends-title">Bạn bè</h2>
          <p className="friends-subtitle">
            Danh sách bạn bè và lời mời kết bạn
          </p>
        </div>

        {isOwnProfile && (
          <div className="flex items-center gap-3">
            {/* Nút switch tab */}
            <div className="inline-flex rounded-full bg-gray-100 p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("friends")}
                className={`px-3 py-1 rounded-full ${
                  activeTab === "friends"
                    ? "bg-white shadow text-gray-900 font-semibold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Bạn bè
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("requests")}
                className={`px-3 py-1 rounded-full ${
                  activeTab === "requests"
                    ? "bg-white shadow text-gray-900 font-semibold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Lời mời kết bạn
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="friends-search-wrapper">
          <input
            type="text"
            placeholder="Tìm bạn bè..."
            className="friends-search-input"
          />
        </div>
      </div>

      {/* Hiển thị Loading hoặc Error */}
      {isLoading && (
        <p className="text-sm text-gray-500">Đang tải danh sách bạn bè...</p>
      )}
      {isError && (
        <p className="text-sm text-red-500">Có lỗi khi tải danh sách.</p>
      )}

      {/* Nội dung theo tab */}
      {!isLoading && (
        <div className="friends-grid">
          {/* Tab: Bạn bè */}
          {activeTab === "friends" && (
            <>
              {friendList.length === 0 && (
                <p className="text-xs text-gray-500">
                  Bạn chưa có người bạn nào.
                </p>
              )}

              {friendList.map((friend) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  isOwnProfile={isOwnProfile}
                  defaultStatus={friend.pivot?.status}
                  onChange={(next) => {
                    // Tương tự, update cache
                    updateFriendInCache(friend.id, next);
                  }}
                  // Nếu muốn danh sách tự cập nhật khi thao tác ở FriendCard,
                  // Bạn cần setup invalidateQueries(['friends', id]) ở FriendCard
                  // hoặc truyền hàm refetch vào đây (nhưng invalidate là cách chuẩn hơn)
                />
              ))}
            </>
          )}

          {/* Tab: Lời mời kết bạn */}
          {activeTab === "requests" && (
            <>
              {requestList.length === 0 && (
                <p className="text-xs text-gray-500">
                  Hiện không có lời mời kết bạn nào.
                </p>
              )}

              {requestList.map((friend) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  isOwnProfile={isOwnProfile}
                  defaultStatus={friend.pivot?.status}
                  onChange={(next) => {
                    // Tương tự, update cache
                    updateFriendInCache(friend.id, next);
                  }}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}