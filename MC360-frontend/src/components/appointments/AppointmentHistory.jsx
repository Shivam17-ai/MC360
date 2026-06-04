import AppointmentCard from "./AppointmentCard";

const sampleHistory = [
  { id: 1, doctorName: "Dr. Priya Sharma", specialization: "Cardiologist", date: "2025-06-10", time: "11:00 AM", status: "completed", type: "consultation" },
  { id: 2, doctorName: "Dr. Rahul Verma", specialization: "Dermatologist", date: "2025-07-02", time: "03:00 PM", status: "cancelled", type: "consultation" },
  { id: 3, doctorName: "Dr. Aisha Khan", specialization: "General Physician", date: "2025-08-15", time: "09:30 AM", status: "confirmed", type: "telemedicine" },
];

const AppointmentHistory = ({ appointments = sampleHistory }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-blue-700">Appointment History</h3>
    {appointments.length === 0 ? (
      <p className="text-gray-400 text-sm text-center py-8">No appointments found.</p>
    ) : (
      appointments.map((appt) => (
        <AppointmentCard key={appt.id} appointment={appt} />
      ))
    )}
  </div>
);

export default AppointmentHistory;