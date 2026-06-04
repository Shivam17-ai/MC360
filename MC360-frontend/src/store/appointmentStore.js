import { create } from "zustand";

const useAppointmentStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────────────
  appointments: [],
  selectedAppointment: null,
  availableSlots: [],
  isLoading: false,
  error: null,
  filters: {
    status: "all",
    type: "all",
    date: null,
  },

  // ── Actions ──────────────────────────────────────────────────────────

  setLoading: (val) => set({ isLoading: val }),

  setError: (msg) => set({ error: msg }),

  clearError: () => set({ error: null }),

  setAppointments: (appointments) => set({ appointments }),

  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [appointment, ...state.appointments],
    })),

  updateAppointment: (id, updatedFields) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a._id === id ? { ...a, ...updatedFields } : a
      ),
      selectedAppointment:
        state.selectedAppointment?._id === id
          ? { ...state.selectedAppointment, ...updatedFields }
          : state.selectedAppointment,
    })),

  cancelAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a._id === id ? { ...a, status: "cancelled" } : a
      ),
    })),

  removeAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((a) => a._id !== id),
    })),

  setSelectedAppointment: (appointment) =>
    set({ selectedAppointment: appointment }),

  clearSelectedAppointment: () => set({ selectedAppointment: null }),

  setAvailableSlots: (slots) => set({ availableSlots: slots }),

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  resetFilters: () =>
    set({ filters: { status: "all", type: "all", date: null } }),

  // ── Selectors ────────────────────────────────────────────────────────

  getFiltered: () => {
    const { appointments, filters } = get();
    return appointments.filter((a) => {
      const matchStatus = filters.status === "all" || a.status === filters.status;
      const matchType = filters.type === "all" || a.type === filters.type;
      const matchDate = !filters.date || a.date === filters.date;
      return matchStatus && matchType && matchDate;
    });
  },

  getUpcoming: () =>
    get().appointments.filter((a) =>
      ["confirmed", "pending"].includes(a.status)
    ),

  getCompleted: () =>
    get().appointments.filter((a) => a.status === "completed"),

  getTodayCount: () => {
    const today = new Date().toISOString().split("T")[0];
    return get().appointments.filter((a) => a.date === today).length;
  },
}));

export default useAppointmentStore;