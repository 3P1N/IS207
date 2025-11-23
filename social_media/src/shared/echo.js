import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios'; // 👈 Import axios instance của bạn (hoặc axios global)

window.Pusher = Pusher;

export function createEcho() {
  const apiBase = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
  // const authEndpoint = `${apiBase}/broadcasting/auth`; // 👈 Không cần dòng này nữa nếu dùng authorizer

  const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 80),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 443),
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],

    // 🛠️ Thay thế toàn bộ phần auth/authEndpoint bằng authorizer này
    authorizer: (channel, options) => {
      return {
        authorize: (socketId, callback) => {
          axios.post('broadcasting/auth', { // 👈 Đường dẫn API auth của bạn
            socket_id: socketId,
            channel_name: channel.name
          }, {
            baseURL: apiBase, // Đảm bảo đúng Base URL
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
    console.log('%c✔ WebSocket connected successfully!', 'color: #4CAF50; font-weight: bold;');
  });

  // 🔥 Lắng nghe lỗi (hữu ích để debug)
  echo.connector.pusher.connection.bind('error', (err) => {
    console.error('❌ WebSocket connection error:', err);
  });

  return echo;
}
