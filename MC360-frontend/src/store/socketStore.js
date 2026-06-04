import { create } from "zustand";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const useSocketStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────────────
  socket: null,
  isConnected: false,
  connectionError: null,
  onlineUsers: [],

  // ── Actions ──────────────────────────────────────────────────────────

  connect: (token) => {
    const existingSocket = get().socket;
    if (existingSocket?.connected) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      set({ isConnected: true, connectionError: null });
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      set({ isConnected: false });
      console.log("Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      set({ connectionError: err.message, isConnected: false });
      console.error("Socket connection error:", err.message);
    });

    socket.on("online_users", (users) => {
      set({ onlineUsers: users });
    });

    set({ socket });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false, onlineUsers: [] });
    }
  },

  // ── Emit helpers ─────────────────────────────────────────────────────

  emit: (event, data) => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.emit(event, data);
    } else {
      console.warn("Socket not connected. Cannot emit:", event);
    }
  },

  joinRoom: (room) => {
    get().emit("join_room", room);
  },

  leaveRoom: (room) => {
    get().emit("leave_room", room);
  },

  joinQueueRoom: (doctorId) => {
    get().emit("join_queue_room", doctorId);
  },

  joinConsultation: (sessionId) => {
    get().emit("join_consultation", sessionId);
  },

  triggerEmergency: (data) => {
    get().emit("emergency_trigger", data);
  },

  logMedicineTaken: (medicineId) => {
    get().emit("medicine_taken", medicineId);
  },

  // ── Listener helpers ─────────────────────────────────────────────────

  on: (event, callback) => {
    const socket = get().socket;
    if (socket) {
      socket.off(event);         // prevent duplicate listeners
      socket.on(event, callback);
    }
  },

  off: (event) => {
    const socket = get().socket;
    if (socket) socket.off(event);
  },

  // ── Selectors ────────────────────────────────────────────────────────

  isUserOnline: (userId) => get().onlineUsers.includes(userId),
}));

export default useSocketStore;