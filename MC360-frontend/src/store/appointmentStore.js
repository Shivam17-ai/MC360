import { create } from 'zustand'
import { appointmentService } from '../services/appointmentService'

export const useAppointmentStore = create((set) => ({
  appointments: [],
  isLoading: false,

  fetch: async (params) => {
    set({ isLoading: true })
    try {
      const res = await appointmentService.getAll(params)
      set({ appointments: res.data || [], isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  cancel: async (id) => {
    await appointmentService.cancel(id)
    set((s) => ({
      appointments: s.appointments.map((a) =>
        a._id === id ? { ...a, status: 'cancelled' } : a
      ),
    }))
  },
}))