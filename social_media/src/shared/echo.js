// src/lib/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

/**
 * Hàm khởi tạo Echo có token
 */
// src/lib/echo.js
export function createEcho(token) {
  const apiBase = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, ''); // remove trailing slash
  const authEndpoint = `${apiBase}/broadcasting/auth`; // -> http://localhost:8000/api/broadcasting/auth

  return new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 80),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 443),
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],

    authEndpoint,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

