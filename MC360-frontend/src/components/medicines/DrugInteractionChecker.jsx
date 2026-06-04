import { useState } from "react";
import { Plus, X, AlertTriangle, CheckCircle, Loader2, Search } from "lucide-react";
import Button from "../common/Button";
import { aiService } from "../../services/aiService";

const DrugInteractionChecker = () => {
  const [drugs, setDrugs] = useState(["", ""]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDrugChange = (index, value) => {
    const updated = [...drugs];
    updated[index] = value;
    setDrugs(updated);
  };

  const addDrug = () => setDrugs((p) => [...p, ""]);
  const removeDrug = (i) => setDrugs((p) => p.filter((_, idx) => idx !== i));

  const handleCheck = async () => {
    const filtered = drugs.filter((d) => d.trim());
    if (filtered.length < 2) {
      setError("Please enter at least 2 drug names.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const data = await aiService.checkDrugInteractions(filtered);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to check interactions.");
    } finally {
      setLoading(false);
    }
  };

  const severityConfig = {
    none: { color: "text-green-600", bg: "bg-green-50 border-green-200", icon: CheckCircle },
    mild: { color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", icon: AlertTriangle },
    moderate: { color: "text-orange-600", bg: "bg-orange-50 border-orange-200", icon: AlertTriangle },
    severe: { color: "text-red-600", bg: "bg-red-50 border-red-200", icon: AlertTriangle },
  };

  const cfg = result ? severityConfig[result.severity] || severityConfig.none : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
          <AlertTriangle size={16} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Drug Interaction Checker</h3>
          <p className="text-xs text-gray-500">Check interactions between multiple medicines</p>
        </div>
      </div>

      {/* Drug inputs */}
      <div className="space-y-2 mb-4">
        {drugs.map((drug, i) => (
          <div key={i} className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={drug}
                onChange={(e) => handleDrugChange(i, e.target.value)}
                placeholder={`Drug ${i + 1} (e.g. Aspirin)`}
                className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
              />
            </div>
            {drugs.length > 2 && (
              <button
                onClick={() => removeDrug(i)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X size={15} />
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addDrug}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus size={13} /> Add another drug
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 mb-3 flex items-center gap-1">
          <AlertTriangle size={12} /> {error}
        </p>
      )}

      <Button onClick={handleCheck} loading={loading} className="w-full">
        {loading ? "Checking..." : "Check Interactions"}
      </Button>

      {/* Result */}
      {result && cfg && (
        <div className={`mt-4 rounded-xl border p-4 ${cfg.bg}`}>
          <div className={`flex items-center gap-2 font-semibold mb-2 ${cfg.color}`}>
            <cfg.icon size={16} />
            <span className="capitalize">{result.severity} Interaction</span>
          </div>
          <p className="text-sm text-gray-700">{result.summary}</p>
          {result.interactions?.length > 0 && (
            <ul className="mt-3 space-y-1">
              {result.interactions.map((item, i) => (
                <li key={i} className="text-xs text-gray-600 flex gap-1">
                  <span className="text-gray-400">•</span> {item}
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-gray-400 mt-3">
            ⚠️ This is AI-generated. Always consult your doctor or pharmacist.
          </p>
        </div>
      )}
    </div>
  );
};

export default DrugInteractionChecker;