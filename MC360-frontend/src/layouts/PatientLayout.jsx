import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

const PatientLayout = ({ children, user }) => {
  const navigate = useNavigate();

  const patientUser = user || {
    name: "Patient User",
    role: "patient",
    email: "patient@example.com",
  };

  return (
    <DashboardLayout role="patient" user={patientUser}>
      {children}
    </DashboardLayout>
  );
};

export default PatientLayout;