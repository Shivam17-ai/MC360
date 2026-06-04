import api from "./api";

const prescriptionService = {
  // Doctor
  createPrescription: (data) => api.post("/prescriptions", data),

  updatePrescription: (id, data) => api.put(`/prescriptions/${id}`, data),

  deletePrescription: (id) => api.delete(`/prescriptions/${id}`),

  getDoctorPrescriptions: (params) => api.get("/prescriptions/doctor", { params }),

  // Patient
  getMyPrescriptions: (params) => api.get("/prescriptions/my", { params }),

  getPrescriptionById: (id) => api.get(`/prescriptions/${id}`),

  downloadPrescription: (id) =>
    api.get(`/prescriptions/${id}/download`, { responseType: "blob" }),

  // Hospital
  getAllPrescriptions: (params) => api.get("/prescriptions", { params }),
};

export default prescriptionService;