import "./profile.css";
import { useEffect, useState, useContext } from "react";
import { api } from "../../shared/api";
import { AuthContext } from "../../router/AuthProvider";
import FriendCard from "./FriendCard";
import { useOutletContext } from "react-router-dom";
export default function ProfileFriend() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("friends"); // "friends" | "requests"
  const {  } = useContext(AuthContext);
  const { profileUser, isOwnProfile } = useOutletContext();
  const getFriends = async () => {
    setLoading(true);
    try {
      const response = await api.get("/friends");
      console.log(response);
      setFriends(response.data.friends || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFriends();
  }, []);

  // Tách 2 list: bạn bè & lời mời (tạm thời lấy những người chưa là bạn)
  const friendList = friends.filter((f) => f.isFriend);      // bạn bè
  const requestList = friends.filter((f) => !f.isFriend);    // lời mời / chưa là bạn

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

        {isOwnProfile && (<div className="flex items-center gap-3">
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
        </div>)}
        <div>
          
        </div>
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
      {loading && (
        <p className="text-sm text-gray-500">Đang tải danh sách bạn bè...</p>
      )}

      {/* Nội dung theo tab */}
      <div className="friends-grid">
        {/* Tab: Bạn bè */}
        {activeTab === "friends" && (
          <>
            {requestList.length === 0 && !loading && (
              <p className="text-xs text-gray-500">
                Bạn chưa có người bạn nào.
              </p>
            )}

            {requestList.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                defaultStatus="friends"
              />
            ))}
          </>
        )}

        {/* Tab: Lời mời kết bạn */}
        { activeTab === "requests" && (
          <>
            {requestList.length === 0 && !loading && (
              <p className="text-xs text-gray-500">
                Hiện không có lời mời kết bạn nào.
              </p>
            )}

            {requestList.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                defaultStatus="none" // để hiện nút "Accept / Add" bên trong FriendCard nếu bạn muốn
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
