import api from "./api";

const appointmentService = {
  // Patient
  bookAppointment: (data) => api.post("/appointments", data),

  getMyAppointments: (params) => api.get("/appointments/my", { params }),

  cancelAppointment: (id) => api.patch(`/appointments/${id}/cancel`),

  rescheduleAppointment: (id, data) => api.patch(`/appointments/${id}/reschedule`, data),

  getAppointmentById: (id) => api.get(`/appointments/${id}`),

  // Doctor
  getDoctorAppointments: (params) => api.get("/appointments/doctor", { params }),

  updateAppointmentStatus: (id, status) =>
    api.patch(`/appointments/${id}/status`, { status }),

  addConsultationNotes: (id, notes) =>
    api.patch(`/appointments/${id}/notes`, { notes }),

  // Availability
  getDoctorSlots: (doctorId, date) =>
    api.get(`/appointments/slots/${doctorId}`, { params: { date } }),

  getAvailableDoctors: (params) => api.get("/appointments/doctors", { params }),

  // Hospital
  getAllAppointments: (params) => api.get("/appointments/hospital", { params }),
};

export default appointmentService;