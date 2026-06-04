import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

const DoctorLayout = ({ children, user }) => {
  const navigate = useNavigate();

  const doctorUser = user || {
    name: "Doctor User",
    role: "doctor",
    email: "doctor@example.com",
  };

  return (
    <DashboardLayout role="doctor" user={doctorUser}>
      {children}
    </DashboardLayout>
  );
};

export default DoctorLayout;