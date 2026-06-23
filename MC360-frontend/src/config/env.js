const isProduction = typeof window !== 'undefined' && 
  window.location.hostname !== 'localhost' && 
  window.location.hostname !== '127.0.0.1';

const defaultApiUrl = isProduction 
  ? 'https://mc360.onrender.com/api/v1' 
  : 'http://localhost:5000/api/v1';

const defaultSocketUrl = isProduction 
  ? 'https://mc360.onrender.com' 
  : 'http://localhost:5000';

export const config = {
  apiUrl: import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.startsWith('http')
    ? import.meta.env.VITE_API_URL
    : (import.meta.env.VITE_API_URL === '/api/v1' && isProduction 
        ? 'https://mc360.onrender.com/api/v1' 
        : (import.meta.env.VITE_API_URL || defaultApiUrl)),
  socketUrl: import.meta.env.VITE_SOCKET_URL || defaultSocketUrl,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
}