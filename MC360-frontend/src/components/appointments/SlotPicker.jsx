const SlotPicker = ({ slots = [], selectedSlot, onSelect }) => {
  const defaultSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM"];
  const displaySlots = slots.length > 0 ? slots : defaultSlots;

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 max-w-sm">
      <h3 className="font-bold text-gray-700 mb-3 text-sm">Select Time Slot</h3>
      <div className="grid grid-cols-3 gap-2">
        {displaySlots.map((slot) => (
          <button
            key={slot}
            onClick={() => onSelect && onSelect(slot)}
            className={`text-xs py-2 px-1 rounded-lg border font-medium transition
              ${selectedSlot === slot
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600"}
            `}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SlotPicker;