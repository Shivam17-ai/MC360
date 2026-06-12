import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import { Search, FileText, Activity, Phone, Mail, MapPin, UserPlus } from 'lucide-react'
import Avatar from '../../components/common/Avatar'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import { formatDate } from '../../utils/formatDate'
import { useDebounce } from '../../hooks/useDebounce'

export default function PatientRecords() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const debounced = useDebounce(search)

  const { data: rawResp, isLoading } = useQuery({
    queryKey: ['doctor-patients', debounced],
    queryFn: () => api.get('/doctors/patients', { params: { search: debounced } }),
  })

  // getMyPatients returns { patients: [...] } in successResponse
  const patients = rawResp?.patients || rawResp?.data?.patients || (Array.isArray(rawResp?.data) ? rawResp.data : [])


  const { data: detailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ['patient-detail', selected?._id],
    queryFn: () => api.get(`/doctors/patients/${selected._id}`),
    enabled: !!selected,
  })

  const patientDetail = detailData?.patient || detailData?.data?.patient || detailData?.data || detailData;

  // Helper to format address object
  const formatAddress = (addr) => {
    if (!addr || typeof addr !== 'object') return '—'
    const parts = [addr.street, addr.city, addr.state, addr.pincode].filter(Boolean)
    return parts.length > 0 ? parts.join(', ') : '—'
  }

  // Helper to format emergency contact
  const formatEmergency = (contact) => {
    if (!contact || typeof contact !== 'object') return '—'
    const parts = [contact.name, contact.relation ? `(${contact.relation})` : '', contact.phone].filter(Boolean)
    return parts.length > 0 ? parts.join(' ') : '—'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Patient Records</h1>
        <p className="section-subtitle">View and manage your patient records</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients by name or phone…" className="input-base pl-9 max-w-md" />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-200 bg-surface-50">
              {['Patient', 'Age / Gender', 'Blood Group', 'Last Visit', 'Records', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>)}</tr>)
            ) : (patients || []).map(pat => (
              <tr key={pat._id} className="hover:bg-surface-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={pat.user?.name || pat.name} size="sm" />
                    <div>
                      <p className="font-medium text-slate-900">{pat.user?.name || pat.name}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-primary-600">{pat.patientId?.replace('MC360-', '')}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-400">{pat.user?.phone || pat.phone}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{pat.age || '—'} / {pat.gender || '—'}</td>
                <td className="px-4 py-3"><Badge variant="red">{pat.bloodGroup || '—'}</Badge></td>
                <td className="px-4 py-3 text-slate-500">{pat.lastVisit ? formatDate(pat.lastVisit) : '—'}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-slate-500 text-xs"><FileText className="w-3 h-3" />{pat.totalRecords || pat.reportsCount || 0} reports</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setSelected(pat)} className="btn-ghost text-xs text-primary-600">View Details →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Patient Details" size="lg">
        {isDetailLoading ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <div className="skeleton w-16 h-16 rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="skeleton h-5 w-1/3" />
                <div className="skeleton h-4 w-1/2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
            </div>
          </div>
        ) : patientDetail && (
          <div className="space-y-6">
            <div className="flex items-center gap-5">
              <Avatar name={patientDetail.user?.name || patientDetail.name} size="xl" src={patientDetail.user?.avatar} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">{patientDetail.user?.name || patientDetail.name}</h3>
                  <Badge variant="blue">{patientDetail.patientId}</Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" />{patientDetail.user?.email || '—'}</span>
                  <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" />{patientDetail.user?.phone || '—'}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  {patientDetail.bloodGroup && <Badge variant="red">{patientDetail.bloodGroup}</Badge>}
                  <Badge variant="gray">{patientDetail.age || '—'} yrs · {patientDetail.gender || '—'}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Date of Birth', value: formatDate(patientDetail.dateOfBirth || patientDetail.dob), icon: Activity },
                { label: 'Gender', value: patientDetail.gender || '—', icon: UserPlus },
                { label: 'Primary Language', value: patientDetail.language || 'English', icon: Activity },
                { label: 'Blood Group', value: patientDetail.bloodGroup || '—', icon: Activity },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-surface-50 rounded-2xl p-4 flex gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-slate-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-surface-200 rounded-2xl p-4 flex gap-4">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Residential Address</p>
                  <p className="text-sm text-slate-700">{formatAddress(patientDetail.address)}</p>
                </div>
              </div>

              <div className="bg-white border border-surface-200 rounded-2xl p-4 flex gap-4">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Emergency Contact</p>
                  <p className="text-sm text-slate-700">{formatEmergency(patientDetail.emergencyContact)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}