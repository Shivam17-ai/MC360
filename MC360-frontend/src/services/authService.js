import api from "./api";

const authService = {
  login: (credentials) => api.post("/auth/login", credentials),

  register: (data) => api.post("/auth/register", data),

  googleLogin: (tokenId) => api.post("/auth/google", { tokenId }),

  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),

  resetPassword: (token, password) =>
    api.post(`/auth/reset-password/${token}`, { password }),

  getMe: () => api.get("/auth/me"),

  updateProfile: (data) => api.put("/auth/profile", data),

  changePassword: (data) => api.put("/auth/change-password", data),

  logout: () => api.post("/auth/logout"),
};

export default authService;