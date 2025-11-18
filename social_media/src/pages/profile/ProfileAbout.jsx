// src/pages/profile/ProfileAbout.jsx
import { useState, useContext } from "react";
import { AuthContext } from "../../router/AuthProvider";
import { useNavigate } from "react-router-dom";
export default function ProfileAbout() {
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();
  // tab hiện tại: "view" hoặc "edit"
  const [activeTab, setActiveTab] = useState("view");

  // dữ liệu form (tạm thời lấy từ userData hoặc giá trị default)
  const [formData, setFormData] = useState({
    displayName: userData?.name || "User Name",
    username: userData?.username || "@username",
    email: userData?.email || "user@example.com",
    gender: userData?.gender || "",
    joinDate: userData?.joinDate || "01/01/2024",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call API update profile ở đây
    console.log("Update profile info:", formData);

    // Sau khi lưu thì quay về tab xem
    setActiveTab("view");
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề + nút mở tab chỉnh sửa */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Giới thiệu</h2>
          <p className="text-sm text-gray-500">
            Thông tin cơ bản về tài khoản của bạn
          </p>
        </div>
      </div>

      {/* Card thông tin cá nhân */}
      <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm sm:p-6">
        {/* Mini-tab: Xem / Chỉnh sửa */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Thông tin cá nhân
          </h3>

          <div className="flex gap-1 rounded-full bg-gray-100 p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("view")}
              className={`px-3 py-1 rounded-full ${
                activeTab === "view"
                  ? "bg-white shadow text-gray-900 font-semibold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Xem
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`px-3 py-1 rounded-full ${
                activeTab === "edit"
                  ? "bg-white shadow text-gray-900 font-semibold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Chỉnh sửa
            </button>
          </div>
        </div>

        {/* Tab XEM thông tin */}
        {activeTab === "view" && (
          <dl className="space-y-3 text-sm text-gray-700">
            <InfoRow label="Tên hiển thị" value={formData.displayName} />
            <InfoRow label="Username" value={formData.username} />
            <InfoRow label="Email" value={formData.email} />
            <InfoRow
              label="Giới tính"
              value={formData.gender || "Chưa cập nhật"}
            />
            <InfoRow label="Ngày tham gia" value={formData.joinDate} />
          </dl>
        )}

        {/* Tab CHỈNH SỬA */}
        {activeTab === "edit" && (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Giới tính</label>
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-600 mb-1">
                  Ngày tham gia
                </label>
                <input
                  type="text"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("view")}
                className="rounded-full border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded-full bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800 active:scale-[0.98] transition"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Button + card quyền riêng tư giữ nguyên */}

      <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm sm:p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Quyền riêng tư
        </h3>

        <ul className="space-y-3 text-sm text-gray-700">
          <PrivacyRow label="Hiển thị thông tin cá nhân" value="Chỉ bạn bè" />
          <PrivacyRow
            label="Cho phép người lạ xem danh sách bạn bè"
            value="Không"
          />
          <PrivacyRow label="Cho phép tìm kiếm bằng email" value="Có" />
        </ul>

        <p className="mt-4 text-xs text-gray-500">
          Bạn có thể thay đổi chi tiết hiển thị trong phần cài đặt quyền riêng tư.
        </p>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate("/setting")}
          className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-gray-800 active:scale-[0.98] transition"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Chỉnh sửa quyền riêng tư
        </button>
      </div>
    </div>
  );
}

// component phụ nhỏ cho gọn code
function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value}</dd>
    </div>
  );
}

function PrivacyRow({ label, value }) {
  return (
    <li className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="inline-flex items-center rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
        {value}
      </span>
    </li>
  );
}
