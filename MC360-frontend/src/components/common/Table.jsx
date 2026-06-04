export default function Table({ columns, data, className = '' }) {
  return (
    <div className={`overflow-x-auto rounded-2xl border border-slate-100 ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            {columns.map((col) => (
              <th key={col.key} className="text-left px-4 py-3 font-medium text-slate-600">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-slate-700">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}