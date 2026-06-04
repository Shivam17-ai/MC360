const DoctorCard = ({ doctor = {}, onBook }) => {
  const {
    name = "Dr. Priya Sharma",
    specialization = "Cardiologist",
    experience = "8 years",
    rating = 4.8,
    fee = 500,
    available = true,
    profilePicture = null,
  } = doctor;

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex gap-4 border border-gray-100 hover:shadow-lg transition">
      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl overflow-hidden shrink-0">
        {profilePicture ? <img src={profilePicture} alt={name} className="w-full h-full object-cover rounded-full" /> : "👨‍⚕️"}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-bold text-gray-800">{name}</p>
            <p className="text-sm text-blue-600">{specialization}</p>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${available ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
            {available ? "Available" : "Busy"}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1 space-x-3">
          <span>⭐ {rating}</span>
          <span>🕒 {experience}</span>
          <span>💰 ₹{fee}</span>
        </div>
        <button
          onClick={onBook}
          disabled={!available}
          className="mt-3 text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-40"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;