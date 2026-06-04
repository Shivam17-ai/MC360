import { Navigate } from "react-router-dom";

const RoleGuard = ({ children, userRole, allowedRoles = [] }) => {
  if (!allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" replace />;
  return children;
};

export default RoleGuard;