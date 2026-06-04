import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";

const defaultForm = {
  name: "",
  dosage: "",
  frequency: "once",
  timings: [""],
  startDate: "",
  endDate: "",
  notes: "",
};

const frequencyOptions = [
  { value: "once", label: "Once a day" },
  { value: "twice", label: "Twice a day" },
  { value: "thrice", label: "Thrice a day" },
  { value: "weekly", label: "Weekly" },
  { value: "custom", label: "Custom" },
];

const MedicineForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...defaultForm,
        ...initialData,
        startDate: initialData.startDate?.slice(0, 10) || "",
        endDate: initialData.endDate?.slice(0, 10) || "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleTimingChange = (index, value) => {
    const updated = [...form.timings];
    updated[index] = value;
    setForm((p) => ({ ...p, timings: updated }));
  };

  const addTiming = () => setForm((p) => ({ ...p, timings: [...p.timings, ""] }));
  const removeTiming = (i) =>
    setForm((p) => ({ ...p, timings: p.timings.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit?.(form);
    setLoading(false);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {initialData ? "Edit Medicine" : "Add Medicine"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Medicine Name *
              </label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Metformin"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Dosage *</label>
              <Input
                name="dosage"
                value={form.dosage}
                onChange={handleChange}
                placeholder="e.g. 500mg"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Frequency *</label>
              <select
                name="frequency"
                value={form.frequency}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {frequencyOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Timings */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Reminder Timings
            </label>
            <div className="space-y-2">
              {form.timings.map((t, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="time"
                    value={t}
                    onChange={(e) => handleTimingChange(i, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {form.timings.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTiming(i)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTiming}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus size={13} /> Add timing
              </button>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. Take after meals"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading} type="submit">
            {initialData ? "Update" : "Add Medicine"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MedicineForm;