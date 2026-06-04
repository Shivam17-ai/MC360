import Badge from '../common/Badge'
import Card from '../common/Card'

const mockQueue = [
  { token: 'A-038', name: 'Rajesh Kumar',  status: 'called',    room: 'Room 3' },
  { token: 'A-039', name: 'Sunita Devi',   status: 'called',    room: 'Room 1' },
  { token: 'A-040', name: 'Amit Sharma',   status: 'waiting',   room: '—' },
  { token: 'A-041', name: 'Meena Patel',   status: 'waiting',   room: '—' },
  { token: 'A-042', name: 'You',           status: 'waiting',   room: '—' },
  { token: 'A-043', name: 'Kavita Singh',  status: 'waiting',   room: '—' },
  { token: 'A-044', name: 'Rahul Verma',   status: 'completed', room: 'Done' },
]

const statusColors = { called: 'green', waiting: 'amber', completed: 'blue' }

export default function QueueBoard({ queue }) {
  const list = queue || mockQueue

  return (
    <Card>
      <h3 className="font-display font-semibold text-slate-800 mb-4">Live Queue Board</h3>
      <div className="space-y-2">
        {list.map((item) => (
          <div key={item.token}
            className={`flex items-center justify-between p-3 rounded-xl transition-colors ${item.name === 'You' ? 'bg-primary-50 border border-primary-200' : 'bg-slate-50'}`}>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold ${item.name === 'You' ? 'text-primary-700' : 'text-slate-700'}`}>
                {item.token}
              </span>
              <span className="text-sm text-slate-600">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">{item.room}</span>
              <Badge variant={statusColors[item.status]} className="capitalize">{item.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}