import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import { Plus, Search, Trash2, UserCheck } from 'lucide-react'
import Avatar from '../../components/common/Avatar'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { SPECIALIZATIONS } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function ManageDoctors() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', specialization: '', experience: '', phone: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['hospital-doctors', search],
    queryFn: () => api.get('/hospital/doctors', { params: { search } }).then(r => r.data),
  })

  const addDoctor = useMutation({
    mutationFn: (d) => api.post('/hospital/doctors', d),
    onSuccess: () => { qc.invalidateQueries(['hospital-doctors']); toast.success('Doctor added'); setModal(false) },
    onError: e => toast.error(e.message),
  })

  const removeDoctor = useMutation({
    mutationFn: (id) => api.delete(`/hospital/doctors/${id}`),
    onSuccess: () => { qc.invalidateQueries(['hospital-doctors']); toast.success('Doctor removed') },
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Manage Doctors</h1>
          <p className="section-subtitle">Add, view, and manage hospital doctors</p>
        </div>
        <Button onClick={() => setModal(true)}><Plus className="w-4 h-4" /> Add Doctor</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search doctors…" className="input-base pl-9 max-w-sm" />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-200 bg-surface-50">
              {['Doctor', 'Specialization', 'Experience', 'Status', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {isLoading ? Array.from({ length: 5 }).map((_, i) => <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>)}</tr>)
              : (data || []).map(doc => (
                <tr key={doc._id} className="hover:bg-surface-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={doc.name} size="sm" />
                      <div>
                        <p className="font-medium text-slate-900">{doc.name}</p>
                        <p className="text-xs text-slate-400">{doc.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{doc.specialization || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{doc.experience ? `${doc.experience} yrs` : '—'}</td>
                  <td className="px-4 py-3"><Badge variant={doc.isActive ? 'green' : 'gray'} dot>{doc.isActive ? 'Active' : 'Inactive'}</Badge></td>
                  <td className="px-4 py-3">
                    <button onClick={() => removeDoctor.mutate(doc._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Doctor">
        <div className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          <Input label="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          <div>
            <label className="label-base">Specialization</label>
            <select value={form.specialization} onChange={e => setForm(p => ({ ...p, specialization: e.target.value }))} className="input-base">
              <option value="">Select…</option>
              {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Input label="Experience (years)" type="number" value={form.experience} onChange={e => setForm(p => ({ ...p, experience: e.target.value }))} />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button loading={addDoctor.isPending} onClick={() => addDoctor.mutate(form)}>Add Doctor</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}