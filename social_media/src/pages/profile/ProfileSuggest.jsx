// src/pages/profile/ProfileSuggest.jsx
import "./profile.css";
import { useContext } from "react";
import { api } from "../../shared/api";
import { AuthContext } from "../../router/AuthProvider";
import FriendCard from "./FriendCard";
import { useOutletContext } from "react-router-dom";
import { useQuery , useQueryClient } from "@tanstack/react-query";

export default function ProfileSuggest() {
  const { token } = useContext(AuthContext); // nếu api đã tự gắn token bằng interceptor thì cái này không cần
  const { profileUser, isOwnProfile } = useOutletContext();
  const id = profileUser?.id;
  const queryClient = useQueryClient();
  const {
    data: suggestions = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["suggest-friends", id],
    enabled: !!id, // chỉ chạy khi đã có id (profileUser load xong)
    queryFn: async () => {
      const response = await api.get(`/suggestfriends/${id}`);
      console.log("hehe");
      console.log(response);

      // tuỳ backend trả gì, mình giữ nguyên logic cũ:
      const all = response.data.friends || [];
      const suggestionList = response.data.friend || all; // fallback nếu friend không có
      return suggestionList;
    },
  });
  const handleSuggestionChange=(friendId,next)=>{
    if (next.status !== "none") {
      queryClient.setQueryData(["suggest-friends", id], (old = []) =>
        old.filter((f) => f.id !== friendId)
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header + search */}
      <div className="friends-header">
        <div>
          <h2 className="friends-title">Gợi ý kết bạn</h2>
          <p className="friends-subtitle">Những người bạn có thể quen</p>
        </div>
      </div>

      <div className="friends-search-wrapper">
        <input
          type="text"
          placeholder="Tìm người dùng..."
          className="friends-search-input"
        />
      </div>

      {isLoading && (
        <p className="text-sm text-gray-500">Đang tải gợi ý kết bạn...</p>
      )}

      {isError && (
        <p className="text-sm text-red-500">
          Lỗi khi tải gợi ý kết bạn.
        </p>
      )}

      <div className="friends-grid">
        {suggestions.length === 0 && !isLoading && !isError && (
          <p className="text-xs text-gray-500">
            Hiện chưa có gợi ý nào.
          </p>
        )}

        {suggestions.map((friend) => (
          <FriendCard
            key={friend.id}
            friend={friend}
            defaultStatus="none"
            isOwnProfile={isOwnProfile}
            onChange={(next)=>{
              handleSuggestionChange(friend.id,next);
            }}
          />
        ))}
      </div>
    </div>
  );
}
