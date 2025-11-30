import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';

window.Pusher = Pusher;

// 🟢 Bật log ra console để debug (giống đoạn script HTML mẫu)
// Bạn nên comment dòng này lại khi lên production
Pusher.logToConsole = true;

export function createEcho() {
  const apiBase = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

  const echo = new Echo({
    broadcaster: 'pusher',
    
    // 1. Key lấy từ env hoặc fallback sang key trong ví dụ HTML của bạn
    key: import.meta.env.VITE_PUSHER_APP_KEY || 'fa5b12accf383fffbde7',
    
    // 2. Cluster là bắt buộc đối với Pusher thật (ví dụ HTML dùng 'ap1')
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'ap1',
    
    // 3. Luôn dùng HTTPS/TLS với Pusher thật
    forceTLS: true,

    // ⚠️ QUAN TRỌNG: Đã XÓA các dòng wsHost, wsPort, wssPort, enabledTransports.
    // Lý do: Đoạn HTML mẫu dùng Pusher.com (cloud), nó tự động kết nối
    // tới server của Pusher dựa trên 'cluster'. Nếu giữ lại wsHost, nó sẽ lỗi.

    // 🛠️ Giữ nguyên Authorizer cũ của bạn để tái sử dụng
    authorizer: (channel, options) => {
      return {
        authorize: (socketId, callback) => {
          axios.post('broadcasting/auth', {
            socket_id: socketId,
            channel_name: channel.name
          }, {
            baseURL: apiBase,
            withCredentials: true
          })
            .then(response => {
              callback(false, response.data);
            })
            .catch(error => {
              callback(true, error);
            });
        }
      };
    },
  });

  // 🔥 Lắng nghe kết nối socket thành công
  echo.connector.pusher.connection.bind('connected', () => {
    console.log('%c✔ WebSocket connected to Pusher (Cloud)!', 'color: #4CAF50; font-weight: bold;');
  });

  // 🔥 Lắng nghe lỗi
  echo.connector.pusher.connection.bind('error', (err) => {
    console.error('❌ WebSocket connection error:', err);
  });

  return echo;
}