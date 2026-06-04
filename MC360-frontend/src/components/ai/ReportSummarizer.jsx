import { useState } from "react";

const ReportSummarizer = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = () => {
    if (!file) return;
    setLoading(true);
    setTimeout(() => {
      setSummary({
        keyFindings: ["Hemoglobin slightly low (11.2 g/dL)", "Vitamin D deficient"],
        abnormalValues: ["HB: 11.2 (Low)", "Vit D: 18 ng/mL (Low)"],
        followUp: "Consult hematologist and take Vitamin D supplements.",
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-lg space-y-4">
      <h2 className="text-xl font-bold text-blue-700">AI Report Summarizer</h2>
      <input
        type="file"
        accept="application/pdf,image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        onClick={handleSummarize}
        disabled={!file || loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Summarizing..." : "Summarize Report"}
      </button>
      {summary && (
        <div className="text-sm space-y-3 bg-blue-50 p-4 rounded-xl">
          <div>
            <p className="font-semibold text-blue-700 mb-1">Key Findings</p>
            <ul className="list-disc list-inside space-y-1">{summary.keyFindings.map((f, i) => <li key={i}>{f}</li>)}</ul>
          </div>
          <div>
            <p className="font-semibold text-red-600 mb-1">Abnormal Values</p>
            <ul className="list-disc list-inside space-y-1 text-red-600">{summary.abnormalValues.map((v, i) => <li key={i}>{v}</li>)}</ul>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Follow-up:</p>
            <p>{summary.followUp}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportSummarizer;