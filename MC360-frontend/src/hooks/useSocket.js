import { useEffect } from "react";
import { io } from "socket.io-client";
import useSocketStore from "../store/socketStore";
import useAuthStore from "../store/authStore";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * useSocket
 * Initializes and tears down the Socket.IO connection.
 * Call once at the app root (e.g., inside App.jsx or DashboardLayout).
 *
 * Usage:
 *   useSocket();   // in App.jsx
 *   const { socket, isConnected } = useSocketStore();  // anywhere else
 */
const useSocket = () => {
  const { setSocket, clearSocket } = useSocketStore();
  const { token, user } = useAuthStore();

  useEffect(() => {
    if (!token || !user) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket.id);
      // Join personal room for targeted notifications
      socket.emit("join", { userId: user._id, role: user.role });
      setSocket(socket, true);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
      setSocket(socket, false);
    });

    socket.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    return () => {
      socket.disconnect();
      clearSocket();
    };
  }, [token, user]);
};

export default useSocket;