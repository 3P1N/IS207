// src/pages/profile/ProfileSuggest.jsx
import "./profile.css";
import { useEffect, useState, useContext } from "react";
import { api } from "../../shared/api";
import { AuthContext } from "../../router/AuthProvider";
import FriendCard from "./FriendCard";

export default function ProfileSuggest() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const {  } = useContext(AuthContext);

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const response = await api.get("/friends");
      console.log(response);

      const all = response.data.friends || [];
      // lấy những người CHƯA phải bạn bè
      const suggestionList = all.filter((f) => !f.isFriend);
      setSuggestions(suggestionList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSuggestions();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header + search */}
      <div className="friends-header">
        <div>
          <h2 className="friends-title">Gợi ý kết bạn</h2>
          <p className="friends-subtitle">
            Những người bạn có thể quen
          </p>
        </div>
      </div>
      <div className="friends-search-wrapper">
          <input
            type="text"
            placeholder="Tìm người dùng..."
            className="friends-search-input"
          />
        </div>  
      {loading && (
        <p className="text-sm text-gray-500">
          Đang tải gợi ý kết bạn...
        </p>
      )}

      <div className="friends-grid">
        {suggestions.length === 0 && !loading && (
          <p className="text-xs text-gray-500">
            Hiện chưa có gợi ý nào.
          </p>
        )}

        {suggestions.map((friend) => (
          <FriendCard key={friend.id} friend={friend} defaultStatus="none" />
        ))}
      </div>
    </div>
  );
}
