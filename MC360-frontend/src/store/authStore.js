import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // ── Actions ────────────────────────────────────────────────────

      setLoading: (val) => set({ isLoading: val }),

      setError: (msg) => set({ error: msg }),

      clearError: () => set({ error: null }),

      login: (user, token, refreshToken) =>
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }),

      updateUser: (updatedFields) =>
        set((state) => ({
          user: { ...state.user, ...updatedFields },
        })),

      setToken: (token) => set({ token }),

      // ── Selectors ──────────────────────────────────────────────────

      getRole: () => get().user?.role || null,

      isPatient: () => get().user?.role === "patient",

      isDoctor: () => get().user?.role === "doctor",

      isHospitalAdmin: () => get().user?.role === "hospital_admin",
    }),
    {
      name: "mc360-auth",           // localStorage key
      partialize: (state) => ({     // only persist these fields
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;