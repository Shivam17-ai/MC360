import api from './api'

export const queueService = {
  join: (doctorId) => api.post('/queue/join', { doctorId }),
  getStatus: (tokenId) => api.get(`/queue/status/${tokenId}`),
  getQueue: (doctorId) => api.get(`/queue/${doctorId}`),
  next: (doctorId) => api.post(`/queue/${doctorId}/next`),
  skip: (tokenId) => api.patch(`/queue/${tokenId}/skip`),
}