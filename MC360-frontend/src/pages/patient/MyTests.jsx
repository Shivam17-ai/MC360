import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { testService } from '../../services/testService'
import { formatDate } from '../../utils/formatDate'
import { FlaskConical, X, Clock, MapPin } from 'lucide-react'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import toast from 'react-hot-toast'

const TABS = ['upcoming', 'completed', 'cancelled']

const TAB_STATUS_MAP = {
  upcoming: 'upcoming',
  completed: 'completed',
  cancelled: 'cancelled',
}

export default function MyTests() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [cancelId, setCancelId] = useState(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['tests', activeTab],
    queryFn: () => testService.getAll({ status: TAB_STATUS_MAP[activeTab] }).then(r => r.data),
  })

  const cancel = useMutation({
    mutationFn: (id) => testService.cancel(id),
    onSuccess: () => {
      toast.success('Test booking cancelled')
      qc.invalidateQueries({ queryKey: ['tests'] })
      setCancelId(null)
    },
    onError: (e) => toast.error(e.message),
  })

  const tests = Array.isArray(data) ? data : (data?.data || [])

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">My Diagnostic Tests</h1>
        <p className="section-subtitle">Track your test bookings and view results</p>
      </div>

      <div className="flex gap-1 bg-surface-100 rounded-xl p-1 w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="flex gap-4">
                <div className="skeleton w-12 h-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-1/3" />
                  <div className="skeleton h-3 w-1/2" />
                </div>
              </div>
            </div>
          ))
        ) : tests.length === 0 ? (
          <div className="card p-16 text-center">
            <FlaskConical className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400">No {activeTab} tests</p>
          </div>
        ) : (
          tests.map(test => (
            <div key={test._id} className="card p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center shrink-0">
                  <FlaskConical className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{test.testName}</h3>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">{test.category} · {test.testId || test.testCode || 'REF-N/A'}</p>
                    </div>
                    <Badge variant={test.status === 'ordered' ? 'yellow' : test.status === 'completed' ? 'green' : test.status === 'cancelled' ? 'red' : 'blue'}>
                      {test.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Scheduled: {formatDate(test.scheduledDate)}</span>
                    {test.homeCollection && (
                      <span className="flex items-center gap-1 text-primary-600 font-medium">
                        <MapPin className="w-3.5 h-3.5" /> Home Collection
                      </span>
                    )}
                  </div>
                  {test.homeCollection && test.collectionAddress && (
                    <p className="text-xs text-slate-400 mt-2 italic">Address: {test.collectionAddress}</p>
                  )}
                </div>
                {test.status === 'ordered' && (
                  <Button size="sm" variant="secondary" onClick={() => setCancelId(test._id)}>
                    <X className="w-3.5 h-3.5" /> Cancel
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={!!cancelId} onClose={() => setCancelId(null)} title="Cancel Test Booking" size="sm">
        <p className="text-sm text-slate-600 mb-5">Are you sure you want to cancel this test booking? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setCancelId(null)}>Keep it</Button>
          <Button variant="danger" loading={cancel.isPending} onClick={() => cancel.mutate(cancelId)}>Yes, Cancel</Button>
        </div>
      </Modal>
    </div>
  )
}
