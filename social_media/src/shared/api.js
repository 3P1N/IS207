import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// THÊM ĐOẠN NÀY: Tự động gắn token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // Lấy token từ kho lưu trữ
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
