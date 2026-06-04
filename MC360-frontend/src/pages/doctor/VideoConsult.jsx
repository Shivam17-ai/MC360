import { useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";

const upcomingCalls = [
  { id: 1, patient: "Aarav Sharma", time: "10:30 AM", date: "Today", reason: "BP Follow-up" },
  { id: 2, patient: "Priya Mehta", time: "02:00 PM", date: "Today", reason: "Fever consultation" },
  { id: 3, patient: "Rohan Das", time: "11:00 AM", date: "Tomorrow", reason: "Diabetes review" },
];

const VideoConsult = ({ user }) => {
  const [inCall, setInCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  return (
    <DoctorLayout user={user}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Video Consultations</h1>

        {!inCall ? (
          <>
            {/* Upcoming Calls */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-700 mb-4">Upcoming Video Calls</h2>
              <div className="space-y-3">
                {upcomingCalls.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                        {c.patient[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{c.patient}</p>
                        <p className="text-xs text-gray-500">{c.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{c.date}</p>
                      <p className="text-sm font-semibold text-gray-700">{c.time}</p>
                    </div>
                    <button
                      onClick={() => setInCall(true)}
                      className="ml-4 bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-green-700 transition"
                    >
                      🎥 Join
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Video Call UI */
          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative h-96 flex items-center justify-center">
              {/* Remote Video */}
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl mx-auto mb-3">👤</div>
                  <p className="text-lg font-semibold">Aarav Sharma</p>
                  <p className="text-sm text-gray-400">Patient</p>
                </div>
              </div>

              {/* Local Video */}
              <div className="absolute bottom-4 right-4 w-28 h-20 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xs border-2 border-gray-600">
                <div className="text-center">
                  <div className="text-2xl">👨‍⚕️</div>
                  <p className="text-xs text-gray-300">You</p>
                </div>
              </div>

              {/* Timer */}
              <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                🔴 00:12:34
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-900 px-6 py-4 flex items-center justify-center gap-4">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition ${micOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-600 hover:bg-red-700"}`}
              >
                {micOn ? "🎙️" : "🔇"}
              </button>
              <button
                onClick={() => setCamOn(!camOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition ${camOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-600 hover:bg-red-700"}`}
              >
                {camOn ? "📹" : "🚫"}
              </button>
              <button className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-xl transition">
                💬
              </button>
              <button className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-xl transition">
                🖥️
              </button>
              <button
                onClick={() => setInCall(false)}
                className="w-14 h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-xl transition"
              >
                📵
              </button>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default VideoConsult;