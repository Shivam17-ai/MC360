export const ENV = {
  API_BASE_URL:      import.meta.env.VITE_API_BASE_URL      || 'http://localhost:8000/api',
  SOCKET_URL:        import.meta.env.VITE_SOCKET_URL        || 'http://localhost:8000',
  FIREBASE_API_KEY:  import.meta.env.VITE_FIREBASE_API_KEY  || '',
  FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  FIREBASE_PROJECT_ID:  import.meta.env.VITE_FIREBASE_PROJECT_ID  || '',
  FIREBASE_APP_ID:      import.meta.env.VITE_FIREBASE_APP_ID      || '',
}
