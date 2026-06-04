const categoryColors = {
  Low: "bg-green-50 border-green-400 text-green-700",
  Moderate: "bg-yellow-50 border-yellow-400 text-yellow-700",
  High: "bg-red-50 border-red-400 text-red-700",
};

const RiskResultCard = ({ type = "Diabetes", riskPercentage = 0, category = "Low", recommendations = [] }) => {
  const colorClass = categoryColors[category] || categoryColors["Low"];
  return (
    <div className={`p-5 rounded-2xl border-2 ${colorClass} max-w-md`}>
      <h3 className="text-lg font-bold mb-1">{type} Risk</h3>
      <div className="text-4xl font-extrabold mb-2">{riskPercentage}%</div>
      <span className="text-sm font-semibold px-3 py-1 rounded-full bg-white/60 border">{category} Risk</span>
      {recommendations.length > 0 && (
        <ul className="mt-4 space-y-1 text-sm list-disc list-inside">
          {recommendations.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      )}
    </div>
  );
};

export default RiskResultCard;