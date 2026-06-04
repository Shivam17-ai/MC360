import { useState } from "react";

const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const BookingCalendar = ({ onDateSelect }) => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState(null);

  const totalDays = daysInMonth(month, year);
  const firstDay = new Date(year, month, 1).getDay();

  const handleSelect = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelected(day);
    if (onDateSelect) onDateSelect(dateStr);
  };

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="text-gray-500 hover:text-blue-600 text-lg px-2">‹</button>
        <span className="font-bold text-gray-700">{MONTHS[month]} {year}</span>
        <button onClick={nextMonth} className="text-gray-500 hover:text-blue-600 text-lg px-2">›</button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 mb-2">
        {DAYS.map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 text-center gap-y-1">
        {Array(firstDay).fill(null).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
          const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => handleSelect(day)}
              className={`w-8 h-8 mx-auto rounded-full text-sm transition
                ${selected === day ? "bg-blue-600 text-white font-bold" : ""}
                ${isPast ? "text-gray-300 cursor-not-allowed" : "hover:bg-blue-100 text-gray-700"}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendar;