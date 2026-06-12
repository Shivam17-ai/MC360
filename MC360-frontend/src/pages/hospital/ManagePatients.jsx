import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import { Search } from 'lucide-react'
import Avatar from '../../components/common/Avatar'
import Badge from '../../components/common/Badge'
import { formatDate } from '../../utils/formatDate'
import { useDebounce } from '../../hooks/useDebounce'

export default function ManagePatients() {
  const [search, setSearch] = useState('')
  const debounced = useDebounce(search)

  const { data, isLoading } = useQuery({
    queryKey: ['hospital-patients', debounced],
    queryFn: () => api.get('/hospital/patients', { params: { search: debounced } }).then(r => r.data),
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Manage Patients</h1>
        <p className="section-subtitle">View all registered patients</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients…" className="input-base pl-9 max-w-sm" />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-200 bg-surface-50">
              {['Patient', 'Contact', 'Blood Group', 'Registered', 'Appointments', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {isLoading ? Array.from({ length: 6 }).map((_, i) => <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>)}</tr>)
              : (data || []).map(pat => (
                <tr key={pat._id} className="hover:bg-surface-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={pat.name} size="sm" />
                      <div>
                        <p className="font-medium text-slate-900">{pat.name}</p>
                        <p className="text-xs text-slate-400">{pat.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{pat.phone || '—'}</td>
                  <td className="px-4 py-3">{pat.bloodGroup ? <Badge variant="red">{pat.bloodGroup}</Badge> : <span className="text-slate-400">—</span>}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(pat.createdAt)}</td>
                  <td className="px-4 py-3 text-slate-600">{pat.appointmentCount || 0}</td>
                  <td className="px-4 py-3"><Badge variant="green" dot>Active</Badge></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}