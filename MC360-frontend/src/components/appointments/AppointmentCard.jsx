const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const AppointmentCard = ({ appointment = {}, onCancel, onReschedule }) => {
  const { doctorName = "Dr. Smith", specialization = "General", date = "2025-08-01", time = "10:00 AM", status = "confirmed", type = "consultation" } = appointment;
  const colorClass = statusColors[status] || statusColors["pending"];

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-gray-800">{doctorName}</p>
          <p className="text-sm text-gray-500">{specialization}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colorClass}`}>{status}</span>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <p>📅 {date} &nbsp; 🕐 {time}</p>
        <p>🏥 Type: <span className="capitalize font-medium">{type}</span></p>
      </div>
      <div className="flex gap-2 mt-1">
        {status !== "cancelled" && status !== "completed" && (
          <>
            <button onClick={onReschedule} className="flex-1 text-sm border border-blue-500 text-blue-600 py-1.5 rounded-lg hover:bg-blue-50 transition">Reschedule</button>
            <button onClick={onCancel} className="flex-1 text-sm border border-red-400 text-red-500 py-1.5 rounded-lg hover:bg-red-50 transition">Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;