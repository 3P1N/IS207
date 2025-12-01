// src/pages/profile/ProfileAbout.jsx
import { alertClasses } from "@mui/material";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../../shared/api";
import { Snackbar, Alert, CircularProgress } from "@mui/material";


export default function ProfileAbout() {
  const { profileUser, isOwnProfile } = useOutletContext();

  // tab hiện tại: "view" hoặc "edit" (chỉ dùng khi là trang của mình)
  const [activeTab, setActiveTab] = useState("view");
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // 'success' | 'error' | 'info' | 'warning'
  });
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  // dữ liệu form (tạm thời lấy từ profileUser hoặc giá trị default)
  const [formData, setFormData] = useState({
    name: profileUser?.name || "User Name",
    email: profileUser?.email || "user@example.com",
    gender: profileUser?.gender || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(formData.gender);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  // chặn reload trang
    setIsLoading(true);
    try {
      await api.patch("/userProfile",
        formData, // ở đây sẽ là formData MỚI NHẤT
      );
      setSnackbar({
        open: true,
        message: "Cập nhật thông tin thành công!",
        severity: "success",
      });
      setActiveTab("view");
    } catch (error) {
      console.error("Lỗi cập nhật profile:", error);
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra, vui lòng thử lại!",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Tiêu đề */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Giới thiệu</h2>
          <p className="text-sm text-gray-500">
            Thông tin cơ bản về tài khoản
          </p>
        </div>
      </div>

      {/* Card thông tin cá nhân */}
      <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm sm:p-6">
        {/* Header + mini-tab (chỉ có khi là trang của mình) */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Thông tin cá nhân
          </h3>

          {isOwnProfile && (
            <div className="flex gap-1 rounded-full bg-gray-100 p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("view")}
                className={`px-3 py-1 rounded-full ${activeTab === "view"
                  ? "bg-white shadow text-gray-900 font-semibold"
                  : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                Xem
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`px-3 py-1 rounded-full ${activeTab === "edit"
                  ? "bg-white shadow text-gray-900 font-semibold"
                  : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                Chỉnh sửa
              </button>
            </div>
          )}
        </div>

        {/* Tab XEM thông tin (luôn dùng cho người khác, hoặc khi mình ở tab view) */}
        {(!isOwnProfile || activeTab === "view") && (
          <dl className="space-y-3 text-sm text-gray-700">
            <InfoRow label="Tên hiển thị" value={formData.name} />
            <InfoRow label="Email" value={formData.email} />
            <InfoRow
              label="Giới tính"
              value={formData.gender || "Chưa cập nhật"}
            />
          </dl>
        )}

        {/* Tab CHỈNH SỬA (chỉ trang của mình mới có) */}
        {isOwnProfile && activeTab === "edit" && (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
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
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="">Choose Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
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
                {isLoading && (
                  <CircularProgress size={14} style={{ color: "white" }} />
                )}
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000} // Tự tắt sau 4 giây
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Vị trí góc dưới phải
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity} // Màu xanh (success) hoặc đỏ (error)
            sx={{ width: "100%" }}
            variant="filled" // Kiểu hiển thị đậm màu
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>

      {/* Card quyền riêng tư */}
      {/* {isOwnProfile && (<div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm sm:p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Quyền riêng tư
        </h3>

        <ul className="space-y-3 text-sm text-gray-700">
          <PrivacyRow
            label="Hiển thị thông tin cá nhân"
            options={["Mọi người", "Chỉ bạn bè", "Chỉ mình tôi"]}
            defaultValue="Chỉ bạn bè"
            editable={isOwnProfile}
          />

          <PrivacyRow
            label="Cho phép người lạ xem danh sách bạn bè"
            options={["Có", "Không"]}
            defaultValue="Không"
            editable={isOwnProfile}
          />

          <PrivacyRow
            label="Cho phép tìm kiếm bằng email"
            options={["Có", "Không"]}
            defaultValue="Có"
            editable={isOwnProfile}
          />
        </ul>

        <p className="mt-4 text-xs text-gray-500">
          {isOwnProfile
            ? "Bạn có thể thay đổi chi tiết hiển thị trong phần cài đặt quyền riêng tư."
            : "Thiết lập quyền riêng tư được người dùng này cấu hình."}
        </p>
      </div>)} */}
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

function PrivacyRow({ label, options, defaultValue, editable }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(defaultValue || options[0]);

  const handleSelect = (opt) => {
    if (!editable) return; // không cho chọn nếu không phải trang mình
    setCurrent(opt);
    setOpen(false);
    // TODO: onChange API ở đây nếu cần
  };

  return (
    <li className="relative flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-gray-600">{label}</span>

      <div className="relative">
        {/* Nút pill */}
        <button
          type="button"
          onClick={() => editable && setOpen((prev) => !prev)}
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow ${editable
            ? "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] transition"
            : "bg-gray-200 text-gray-700 cursor-default"
            }`}
        >
          <span>{current}</span>
        </button>

        {/* Menu lựa chọn – chỉ hiện nếu được phép edit */}
        {editable && open && (
          <div className="absolute right-0 z-10 mt-1 w-40 rounded-lg border border-gray-200 bg-white py-1 text-xs shadow-lg">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`block w-full px-3 py-1.5 text-left hover:bg-gray-100 ${opt === current ? "font-semibold text-gray-900" : "text-gray-700"
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
