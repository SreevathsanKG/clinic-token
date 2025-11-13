import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

// Create a single shared socket instance
export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
});

// Optional: helpful debug logging (comment out if noisy)
socket.on('connect_error', (err) => {
  console.error('Socket connect_error:', err?.message || err);
});
socket.on('reconnect_attempt', (count) => {
  console.log('Socket reconnect attempt', count);
});
