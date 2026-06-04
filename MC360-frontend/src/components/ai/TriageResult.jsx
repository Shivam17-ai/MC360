const levelColors = {
  Low: "bg-green-100 text-green-700 border-green-300",
  Moderate: "bg-yellow-100 text-yellow-700 border-yellow-300",
  High: "bg-orange-100 text-orange-700 border-orange-300",
  Critical: "bg-red-100 text-red-700 border-red-300",
};

const TriageResult = ({ level = "Low", recommendation = "", urgency = "" }) => {
  const colorClass = levelColors[level] || levelColors["Low"];
  return (
    <div className={`p-4 rounded-xl border ${colorClass} text-sm space-y-1`}>
      <p className="text-base font-bold">Triage Level: {level}</p>
      {recommendation && <p><span className="font-semibold">Recommendation:</span> {recommendation}</p>}
      {urgency && <p><span className="font-semibold">Urgency:</span> {urgency}</p>}
    </div>
  );
};

export default TriageResult;