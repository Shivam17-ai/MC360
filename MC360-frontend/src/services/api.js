import axios from 'axios'
import { ENV } from '../config/env.js'

const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mc360_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mc360_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── Request interceptor: attach JWT ──────────────────────────
api.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem("auth-storage");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const token = parsed?.state?.token;
        if (token) config.headers.Authorization = `Bearer ${token}`;
      } catch {}
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 ────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth-storage");
      window.location.href = "/login";
    }
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default api;
