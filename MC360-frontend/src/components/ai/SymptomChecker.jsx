import { useState } from "react";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult({
        triageLevel: "Moderate",
        recommendation: "Visit a General Physician",
        urgency: "Within 24 hours",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-xl">
      <h2 className="text-xl font-bold text-blue-700 mb-4">AI Symptom Checker</h2>
      <textarea
        className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={4}
        placeholder="Describe your symptoms (e.g. headache, fever, cough...)"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />
      <button
        onClick={handleCheck}
        disabled={loading}
        className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Check Symptoms"}
      </button>
      {result && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-sm">
          <p><span className="font-semibold">Triage Level:</span> {result.triageLevel}</p>
          <p><span className="font-semibold">Recommendation:</span> {result.recommendation}</p>
          <p><span className="font-semibold">Urgency:</span> {result.urgency}</p>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;