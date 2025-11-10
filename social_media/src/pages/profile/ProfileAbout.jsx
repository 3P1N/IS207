export default function ProfileAbout() {
  return (
    <div className="space-y-6">
      {/* Tiêu đề */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Giới thiệu</h2>
          <p className="text-sm text-gray-500">
            Thông tin cơ bản về tài khoản của bạn
          </p>
        </div>

        {/* Nút chỉnh sửa privacy */}
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-gray-800 active:scale-[0.98] transition"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Chỉnh sửa quyền riêng tư
        </button>
      </div>

      {/* Card thông tin cá nhân */}
      <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm sm:p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Thông tin cá nhân
        </h3>

        <dl className="space-y-3 text-sm text-gray-700">
          <InfoRow label="Tên hiển thị" value="User Name" />
          <InfoRow label="Username" value="@username" />
          <InfoRow label="Email" value="user@example.com" />
          <InfoRow label="Giới tính" value="Chưa cập nhật" />
          <InfoRow label="Ngày tham gia" value="01/01/2024" />
        </dl>
      </div>

      {/* Card cài đặt quyền riêng tư */}
      <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm sm:p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Quyền riêng tư
        </h3>

        <ul className="space-y-3 text-sm text-gray-700">
          <PrivacyRow
            label="Hiển thị thông tin cá nhân"
            value="Chỉ bạn bè"
          />
          <PrivacyRow
            label="Cho phép người lạ xem danh sách bạn bè"
            value="Không"
          />
          <PrivacyRow
            label="Cho phép tìm kiếm bằng email"
            value="Có"
          />
        </ul>

        <p className="mt-4 text-xs text-gray-500">
          Bạn có thể thay đổi chi tiết hiển thị trong phần cài đặt quyền riêng tư.
        </p>
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
