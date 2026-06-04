import { useState } from 'react'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import { Calendar, Clock, Video } from 'lucide-react'

const appointments = [
  { id: 1, doctor: 'Dr. Rahul Mehta',  specialization: 'Cardiologist',      date: 'Dec 18, 2024', time: '3:00 PM',  type: 'video',    status: 'confirmed' },
  { id: 2, doctor: 'Dr. Priya Singh',  specialization: 'Dermatologist',     date: 'Dec 19, 2024', time: '11:00 AM', type: 'in-person', status: 'pending' },
  { id: 3, doctor: 'Dr. Anil Kumar',   specialization: 'General Physician', date: 'Dec 10, 2024', time: '9:00 AM',  type: 'in-person', status: 'completed' },
  { id: 4, doctor: 'Dr. Sneha Patel',  specialization: 'Gynecologist',      date: 'Nov 28, 2024', time: '2:00 PM',  type: 'video',    status: 'cancelled' },
]

const tabs    = ['All', 'Upcoming', 'Completed', 'Cancelled']
const statusColors = { confirmed: 'green', pending: 'amber', completed: 'blue', cancelled: 'red' }

export default function MyAppointments() {
  const [tab, setTab] = useState('All')

  const filtered = appointments.filter((a) => {
    if (tab === 'Upcoming')  return ['confirmed', 'pending'].includes(a.status)
    if (tab === 'Completed') return a.status === 'completed'
    if (tab === 'Cancelled') return a.status === 'cancelled'
    return true
  })

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-display font-bold text-slate-800">My Appointments</h1>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === t ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No appointments found" description="Book an appointment to get started." />
      ) : (
        <div className="space-y-4">
          {filtered.map((appt) => (
            <Card key={appt.id} className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center">
                  {appt.doctor.split(' ')[1][0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{appt.doctor}</p>
                  <p className="text-xs text-slate-400">{appt.specialization}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar size={12} />{appt.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{appt.time}</span>
                    <span className="flex items-center gap-1"><Video size={12} />{appt.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={statusColors[appt.status]}>{appt.status}</Badge>
                {appt.type === 'video' && appt.status === 'confirmed' && (
                  <Button size="sm">Join Call</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}