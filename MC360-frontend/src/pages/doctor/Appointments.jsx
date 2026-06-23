import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { appointmentService } from '../../services/appointmentService'
import api from '../../services/api'
import {
  Calendar, Video, User, CheckCircle, RefreshCcw, XCircle, Upload, FileText, Loader2
} from 'lucide-react'
import Avatar from '../../components/common/Avatar'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import { formatDate } from '../../utils/formatDate'
import toast from 'react-hot-toast'

const TABS = ['today', 'upcoming', 'completed', 'cancelled']

const getTabParams = (tab) => {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)
  const tomorrow = new Date(todayEnd.getTime() + 1)

  if (tab === 'today')     return { status: 'confirmed', from: todayStart.toISOString(), to: todayEnd.toISOString() }
  if (tab === 'upcoming')  return { status: 'confirmed', from: tomorrow.toISOString() }
  if (tab === 'completed') return { status: 'completed' }
  return { status: 'cancelled' }
}

const CLOSE_REVISIT  = { open: false, appt: null, days: '7' }
const CLOSE_REPORT   = { open: false, appt: null, title: '', type: 'other', file: null, uploading: false }

export default function DoctorAppointments() {
  const [tab, setTab] = useState('today')
  const queryClient  = useQueryClient()

  const [revisitModal, setRevisitModal] = useState(CLOSE_REVISIT)
  const [reportModal,  setReportModal]  = useState(CLOSE_REPORT)

  /* ─── data ─── */
  const { data, isLoading } = useQuery({
    queryKey: ['doctor-appointments', tab, new Date().toDateString()],
    queryFn:  () => appointmentService.getAll(getTabParams(tab)).then(r => r.data),
  })

  /* ─── mutations ─── */
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => appointmentService.updateStatus(id, data),
    onSuccess: () => { queryClient.invalidateQueries(['doctor-appointments']); toast.success('Appointment updated') },
    onError:   () => toast.error('Failed to update'),
  })

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }) => appointmentService.cancel(id, { reason }),
    onSuccess: () => { queryClient.invalidateQueries(['doctor-appointments']); toast.success('Appointment cancelled') },
    onError:   () => toast.error('Failed to cancel'),
  })

  /* ─── handlers ─── */
  const handleComplete = (id) =>
    updateMutation.mutate({ id, data: { status: 'completed', followUpRequired: false } })

  const handleCancel = (id) => {
    const reason = window.prompt('Reason for cancellation?')
    if (reason !== null) cancelMutation.mutate({ id, reason })
  }

  const submitRevisit = () => {
    const days = parseInt(revisitModal.days, 10)
    if (!days || days < 1) return toast.error('Enter a valid number of days')
    const followUpDate = new Date()
    followUpDate.setDate(followUpDate.getDate() + days)
    updateMutation.mutate({
      id: revisitModal.appt._id,
      data: { status: 'completed', followUpRequired: true, followUpDate: followUpDate.toISOString() },
    })
    setRevisitModal(CLOSE_REVISIT)
  }

  const submitReport = async () => {
    if (!reportModal.file)         return toast.error('Please select a file')
    if (!reportModal.title.trim()) return toast.error('Please enter a report title')

    setReportModal(p => ({ ...p, uploading: true }))
    try {
      const fd = new FormData()
      fd.append('file',          reportModal.file)
      fd.append('patientId',     reportModal.appt.patient._id)
      fd.append('appointmentId', reportModal.appt._id)
      fd.append('title',         reportModal.title.trim())
      fd.append('type',          reportModal.type)

      await api.post('/reports/for-patient', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Report uploaded successfully')
      setReportModal(CLOSE_REPORT)
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Upload failed')
      setReportModal(p => ({ ...p, uploading: false }))
    }
  }

  const appts = data || []

  /* ─── follow-up preview date ─── */
  const previewFollowUp = () => {
    const d = parseInt(revisitModal.days, 10)
    if (!d || d < 1) return null
    return new Date(Date.now() + d * 86_400_000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  /* ─── ui ─── */
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Appointments</h1>
        <p className="section-subtitle">Manage your consultation schedule</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-surface-100 rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all
              ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50">
                {['Patient', 'Date & Time', 'Type', 'Reason', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : appts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    No {tab} appointments
                  </td>
                </tr>
              ) : appts.map(appt => (
                <tr key={appt._id} className="hover:bg-surface-50 transition-colors">

                  {/* Patient */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={appt.patient?.user?.name} size="sm" />
                      <div>
                        <p className="font-medium text-slate-900">{appt.patient?.user?.name || '—'}</p>
                        <p className="text-[10px] font-bold text-primary-600 tracking-tight">{appt.patient?.patientId?.replace('MC360-', '')}</p>
                        <p className="text-xs text-slate-400">{appt.patient?.user?.phone}</p>
                      </div>
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="px-4 py-3">
                    <p className="text-slate-700">{formatDate(appt.date)}</p>
                    <p className="text-xs text-slate-400">{appt.timeSlot}</p>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <Badge variant={appt.type === 'telemedicine' ? 'blue' : 'gray'}>
                      {appt.type === 'telemedicine' ? <Video className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {appt.type}
                    </Badge>
                  </td>

                  {/* Reason */}
                  <td className="px-4 py-3 text-slate-600 max-w-[160px] truncate">{appt.reason}</td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <Badge variant={
                        appt.status === 'confirmed'  ? 'green' :
                        appt.status === 'completed'  ? 'blue'  :
                        appt.status === 'cancelled'  ? 'red'   : 'gray'
                      }>
                        {appt.status}
                      </Badge>
                      {appt.followUpRequired && (
                        <Badge variant="yellow" className="text-[10px] py-0">
                          Revisit {appt.followUpDate
                            ? `· ${new Date(appt.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                            : ''}
                        </Badge>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2 items-center">

                      {/* ── confirmed: Complete / Revisit / Cancel ── */}
                      {appt.status === 'confirmed' && (
                        <>
                          <button
                            onClick={() => handleComplete(appt._id)}
                            disabled={updateMutation.isPending}
                            title="Mark Completed"
                            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg
                              text-emerald-700 bg-emerald-50 border border-emerald-100
                              hover:bg-emerald-100 transition-colors disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Complete
                          </button>

                          <button
                            onClick={() => setRevisitModal({ open: true, appt, days: '7' })}
                            disabled={updateMutation.isPending}
                            title="Schedule Revisit"
                            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg
                              text-amber-700 bg-amber-50 border border-amber-100
                              hover:bg-amber-100 transition-colors disabled:opacity-50"
                          >
                            <RefreshCcw className="w-3.5 h-3.5" /> Revisit
                          </button>

                          <button
                            onClick={() => handleCancel(appt._id)}
                            disabled={cancelMutation.isPending}
                            title="Cancel Appointment"
                            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg
                              text-red-700 bg-red-50 border border-red-100
                              hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancel
                          </button>
                        </>
                      )}

                      {/* ── completed: Upload Report ── */}
                      {appt.status === 'completed' && (
                        <button
                          onClick={() => setReportModal({ open: true, appt, title: '', type: 'other', file: null, uploading: false })}
                          title="Upload Patient Report"
                          className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg
                            text-primary-700 bg-primary-50 border border-primary-100
                            hover:bg-primary-100 transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" /> Upload Report
                        </button>
                      )}

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════ Revisit Modal ══════════════ */}
      <Modal
        isOpen={revisitModal.open}
        onClose={() => setRevisitModal(CLOSE_REVISIT)}
        title="Schedule Patient Revisit"
        size="sm"
      >
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <Avatar name={revisitModal.appt?.patient?.user?.name} size="sm" />
            <div>
              <p className="text-sm font-semibold text-slate-900">{revisitModal.appt?.patient?.user?.name}</p>
              <p className="text-xs text-slate-500">{revisitModal.appt?.timeSlot} · {formatDate(revisitModal.appt?.date)}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Follow-up after how many days?
            </label>
            <input
              type="number"
              min={1}
              max={365}
              value={revisitModal.days}
              onChange={e => setRevisitModal(p => ({ ...p, days: e.target.value }))}
              className="input-base text-lg font-bold text-center"
              placeholder="e.g. 7"
            />
            {previewFollowUp() && (
              <p className="text-xs text-slate-400 mt-2 text-center">
                📅 Revisit date: <span className="font-semibold text-slate-700">{previewFollowUp()}</span>
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-1 border-t border-surface-100">
            <button
              onClick={() => setRevisitModal(CLOSE_REVISIT)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-surface-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submitRevisit}
              disabled={updateMutation.isPending}
              className="px-4 py-2 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600
                rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Confirm Revisit
            </button>
          </div>
        </div>
      </Modal>

      {/* ══════════════ Report Upload Modal ══════════════ */}
      <Modal
        isOpen={reportModal.open}
        onClose={() => !reportModal.uploading && setReportModal(CLOSE_REPORT)}
        title="Upload Patient Report"
        size="md"
      >
        <div className="space-y-5">
          {/* Patient info bar */}
          <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl border border-primary-100">
            <Avatar name={reportModal.appt?.patient?.user?.name} size="sm" />
            <div>
              <p className="text-sm font-semibold text-slate-900">{reportModal.appt?.patient?.user?.name}</p>
              <p className="text-xs text-slate-500">{reportModal.appt?.timeSlot} · {formatDate(reportModal.appt?.date)}</p>
            </div>
          </div>

          {/* Report Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Report Title *
            </label>
            <input
              type="text"
              className="input-base"
              placeholder="e.g. Blood Test Report, Chest X-Ray"
              value={reportModal.title}
              onChange={e => setReportModal(p => ({ ...p, title: e.target.value }))}
            />
          </div>

          {/* Report Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Report Type
            </label>
            <select
              className="input-base"
              value={reportModal.type}
              onChange={e => setReportModal(p => ({ ...p, type: e.target.value }))}
            >
              <option value="lab-report">Lab Report</option>
              <option value="imaging">Imaging (X-Ray / MRI / CT)</option>
              <option value="prescription">Prescription</option>
              <option value="discharge-summary">Discharge Summary</option>
              <option value="vaccination">Vaccination</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* File picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              File (PDF or Image) *
            </label>
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-surface-200 rounded-xl cursor-pointer hover:border-primary-300 hover:bg-primary-50/50 transition-colors">
              <Upload className="w-6 h-6 text-slate-300 mb-1" />
              <span className="text-xs text-slate-400">Click to browse or drag & drop</span>
              <span className="text-[10px] text-slate-300 mt-0.5">PDF, JPG, PNG accepted</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={e => setReportModal(p => ({ ...p, file: e.target.files?.[0] || null }))}
              />
            </label>
            {reportModal.file && (
              <div className="mt-2 flex items-center gap-2 p-2 bg-surface-50 rounded-lg border border-surface-200">
                <FileText className="w-4 h-4 text-primary-500 shrink-0" />
                <span className="text-xs text-slate-700 truncate">{reportModal.file.name}</span>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {(reportModal.file.size / 1024).toFixed(0)} KB
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-1 border-t border-surface-100">
            <button
              onClick={() => setReportModal(CLOSE_REPORT)}
              disabled={reportModal.uploading}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-surface-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={submitReport}
              disabled={reportModal.uploading}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700
                rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {reportModal.uploading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                : <><Upload className="w-4 h-4" /> Upload Report</>}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}