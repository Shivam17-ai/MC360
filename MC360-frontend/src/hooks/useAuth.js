import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

/**
 * useAuth
 * - Exposes auth state and helpers
 * - Optionally redirects if not authenticated or wrong role
 *
 * Usage:
 *   const { user, isAuthenticated, logout } = useAuth();
 *   const { user } = useAuth({ requireAuth: true, role: "doctor" });
 */
const useAuth = (options = {}) => {
  const { requireAuth = false, role = null } = options;
  const { user, token, isAuthenticated, logout, setUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    if (role && user?.role !== role) {
      navigate(`/${user?.role}/dashboard`, { replace: true });
    }
  }, [isAuthenticated, user, requireAuth, role]);

  return { user, token, isAuthenticated, logout, setUser };
};

export default useAuth;