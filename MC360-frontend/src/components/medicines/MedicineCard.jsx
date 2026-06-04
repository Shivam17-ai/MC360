import { Pill, Clock, Trash2, Edit2, CheckCircle2, XCircle } from "lucide-react";
import Badge from "../common/Badge";

const frequencyLabel = {
  once: "Once a day",
  twice: "Twice a day",
  thrice: "Thrice a day",
  weekly: "Weekly",
  custom: "Custom",
};

const MedicineCard = ({ medicine, onEdit, onDelete, onToggleTaken }) => {
  const { _id, name, dosage, frequency, timings = [], isTaken, notes, startDate, endDate } = medicine;

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md ${
        isTaken ? "border-green-200 bg-green-50/30" : "border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isTaken ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
            }`}
          >
            <Pill size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">{name}</h3>
            <p className="text-xs text-gray-500">{dosage}</p>
          </div>
        </div>
        <Badge variant={isTaken ? "success" : "warning"}>
          {isTaken ? "Taken" : "Pending"}
        </Badge>
      </div>

      {/* Frequency & timings */}
      <div className="flex flex-wrap gap-2 text-xs text-gray-600">
        <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
          <Clock size={12} />
          {frequencyLabel[frequency] || frequency}
        </span>
        {timings.map((t, i) => (
          <span key={i} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">
            {t}
          </span>
        ))}
      </div>

      {/* Dates */}
      {(startDate || endDate) && (
        <p className="text-xs text-gray-400">
          {startDate && `From ${new Date(startDate).toLocaleDateString()}`}
          {endDate && ` → ${new Date(endDate).toLocaleDateString()}`}
        </p>
      )}

      {/* Notes */}
      {notes && (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 italic">
          {notes}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <button
          onClick={() => onToggleTaken?.(_id)}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
            isTaken
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          {isTaken ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
          {isTaken ? "Mark Undone" : "Mark Taken"}
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(medicine)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => onDelete?.(_id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;