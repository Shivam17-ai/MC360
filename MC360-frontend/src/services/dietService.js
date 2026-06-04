import api from "./api";

const dietService = {
  getDietPlans: () => api.get("/diet/plans"),

  getDietPlanById: (id) => api.get(`/diet/plans/${id}`),

  generateDietPlan: (preferences) => api.post("/diet/generate", preferences),

  saveDietPlan: (data) => api.post("/diet/plans", data),

  updateDietPlan: (id, data) => api.put(`/diet/plans/${id}`, data),

  deleteDietPlan: (id) => api.delete(`/diet/plans/${id}`),

  getNutritionSummary: (date) =>
    api.get("/diet/nutrition-summary", { params: { date } }),

  logMeal: (data) => api.post("/diet/meal-log", data),

  getMealLogs: (params) => api.get("/diet/meal-logs", { params }),
};

export default dietService;