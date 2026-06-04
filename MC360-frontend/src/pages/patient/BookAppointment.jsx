import { useState } from 'react'
import { Search, MapPin, Star } from 'lucide-react'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'

const doctors = [
  { id: 1, name: 'Dr. Rahul Mehta',  specialization: 'Cardiologist',      rating: 4.9, experience: '12 years', fee: 800,  location: 'Delhi',  available: true },
  { id: 2, name: 'Dr. Priya Singh',  specialization: 'Dermatologist',     rating: 4.7, experience: '8 years',  fee: 600,  location: 'Mumbai', available: true },
  { id: 3, name: 'Dr. Anil Kumar',   specialization: 'General Physician', rating: 4.5, experience: '15 years', fee: 400,  location: 'Delhi',  available: false },
  { id: 4, name: 'Dr. Sneha Patel',  specialization: 'Gynecologist',      rating: 4.8, experience: '10 years', fee: 700,  location: 'Pune',   available: true },
]

export default function BookAppointment() {
  const [search, setSearch] = useState('')

  const filtered = doctors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-800">Book Appointment</h1>
        <p className="text-slate-500 text-sm mt-1">Find and book your doctor.</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="input pl-9"
          placeholder="Search by doctor name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <Card key={doc.id} hover className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center">
                {doc.name.split(' ')[1][0]}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{doc.name}</p>
                <p className="text-xs text-slate-400">{doc.specialization}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span className="flex items-center gap-1"><Star size={13} className="text-amber-400 fill-amber-400" />{doc.rating}</span>
              <span>{doc.experience}</span>
              <span className="flex items-center gap-1"><MapPin size={13} />{doc.location}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <p className="font-semibold text-slate-800">₹{doc.fee}</p>
              <Badge variant={doc.available ? 'green' : 'red'}>{doc.available ? 'Available' : 'Unavailable'}</Badge>
            </div>
            <Button className="w-full" disabled={!doc.available}>Book Now</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}