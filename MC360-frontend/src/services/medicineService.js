import api from "./api";

const medicineService = {
  getMedicines: () => api.get("/medicines"),

  getMedicineById: (id) => api.get(`/medicines/${id}`),

  addMedicine: (data) => api.post("/medicines", data),

  updateMedicine: (id, data) => api.put(`/medicines/${id}`, data),

  deleteMedicine: (id) => api.delete(`/medicines/${id}`),

  toggleTaken: (id) => api.patch(`/medicines/${id}/toggle-taken`),

  getAdherenceStats: (range = "7d") =>
    api.get("/medicines/adherence", { params: { range } }),

  // Doctor: get a patient's medicines
  getPatientMedicines: (patientId) =>
    api.get(`/medicines/patient/${patientId}`),
};

export default medicineService;