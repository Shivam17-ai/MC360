import { clsx } from 'clsx'

export default function Table({ columns, data, loading, emptyText = 'No records found' }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-200">
            {columns.map((col) => (
              <th key={col.key} className={clsx('px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide', col.className)}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="skeleton h-4 rounded" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400 text-sm">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row._id || i} className="hover:bg-surface-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={clsx('px-4 py-3 text-slate-700', col.cellClassName)}>
                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}