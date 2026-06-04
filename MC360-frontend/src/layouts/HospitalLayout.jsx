import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

const HospitalLayout = ({ children, user }) => {
  const navigate = useNavigate();

  const hospitalUser = user || {
    name: "Hospital Admin",
    role: "hospital_admin",
    email: "admin@hospital.com",
  };

  return (
    <DashboardLayout role="hospital_admin" user={hospitalUser}>
      {children}
    </DashboardLayout>
  );
};

export default HospitalLayout;