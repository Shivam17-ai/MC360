import axios from 'axios'
import { config } from '../config/env'
import { storage } from '../utils/storage'

const api = axios.create({
  baseURL: config.apiUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use((req) => {
  const token = storage.get('token')
//   console.log("🚀 Token being sent to backend:", token);
  if (token) req.headers.Authorization = `Bearer ${token}`
  return req
})

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.message || 'Something went wrong'
    if (err.response?.status === 401) {
      storage.remove('token')
      storage.remove('user')
    }
    const error = new Error(message)
    error.status = err.response?.status
    return Promise.reject(error)
  },
)

export default api