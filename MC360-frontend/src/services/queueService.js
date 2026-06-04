import api from "./api";

const queueService = {
  getQueue: (doctorId) => api.get(`/queue/${doctorId}`),

  joinQueue: (doctorId, data) => api.post(`/queue/${doctorId}/join`, data),

  leaveQueue: (tokenId) => api.delete(`/queue/token/${tokenId}`),

  advanceQueue: (doctorId) => api.patch(`/queue/${doctorId}/advance`),

  getMyToken: (doctorId) => api.get(`/queue/${doctorId}/my-token`),

  resetQueue: (doctorId) => api.delete(`/queue/${doctorId}/reset`),

  // Hospital
  getAllQueues: () => api.get("/queue/hospital/all"),
};

export default queueService;