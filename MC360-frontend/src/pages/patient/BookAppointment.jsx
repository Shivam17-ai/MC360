import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { appointmentService } from '../../services/appointmentService'
import { SPECIALIZATIONS } from '../../utils/constants'
import { formatDate } from '../../utils/formatDate'
import { Search, Calendar, Clock, MapPin, Video, User } from 'lucide-react'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import Avatar from '../../components/common/Avatar'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function BookAppointment() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [mode, setMode] = useState('in-person')
  const [reason, setReason] = useState('')
  const [showModal, setShowModal] = useState(false)

  const { data: doctors, isLoading } = useQuery({
    queryKey: ['doctors', search, specialization],
    queryFn: () => appointmentService.getDoctors({ search, specialization }).then(r => r.data),
    keepPreviousData: true,
  })

  const { data: slots, isLoading: slotsLoading } = useQuery({
    queryKey: ['slots', selectedDoctor?._id, selectedDate],
    queryFn: () => appointmentService.getSlots(selectedDoctor._id, selectedDate).then(r => r.data.availability?.slots || []),
    enabled: !!selectedDoctor && !!selectedDate,
  })

  const book = useMutation({
    mutationFn: appointmentService.create,
    onSuccess: () => {
      toast.success('Appointment booked successfully!')
      navigate('/patient/appointments')
    },
    onError: (e) => toast.error(e.message),
  })

  const handleBooking = () => {
    if (!selectedSlot || !reason.trim()) return toast.error('Select a slot and add a reason')
    book.mutate({
      doctorId: selectedDoctor._id,
      date: selectedDate,
      timeSlot: selectedSlot,
      type: mode,
      reason,
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Book Appointment</h1>
        <p className="section-subtitle">Find and book a doctor consultation</p>
      </div>

      {/* Filters */}
      <div className="card p-5">
        <div className="grid md:grid-cols-3 gap-4">
          <Input
            placeholder="Search doctors by name…"
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            value={specialization}
            onChange={e => setSpecialization(e.target.value)}
            className="input-base"
          >
            <option value="">All Specializations</option>
            {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary-500 bg-primary-50 text-primary-700 text-sm font-medium">
              <User className="w-3.5 h-3.5" />
              In-Person Consultation
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Doctor list */}
        <div className="lg:col-span-2 space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card p-5 space-y-3">
                <div className="flex gap-3">
                  <div className="skeleton w-14 h-14 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-1/2" />
                    <div className="skeleton h-3 w-1/3" />
                    <div className="skeleton h-3 w-2/3" />
                  </div>
                </div>
              </div>
            ))
          ) : !doctors?.length ? (
            <div className="card p-12 text-center">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400">No doctors found</p>
            </div>
          ) : (
            doctors.map(doc => (
              <div
                key={doc._id}
                onClick={() => { setSelectedDoctor(doc); setShowModal(true) }}
                className={`card-hover p-5 cursor-pointer transition-all ${selectedDoctor?._id === doc._id ? 'ring-2 ring-primary-500' : ''}`}
              >
                <div className="flex gap-4">
                  <Avatar name={doc.name} src={doc.avatar} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-slate-900">{doc.name}</h3>
                        <p className="text-sm text-slate-500">{doc.specialization}</p>
                      </div>

                    </div>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{doc.hospital?.name || 'Private Practice'}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{doc.experience ?? 0}+ yrs exp</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {[0, 1, 2, 3, 4, 5, 6].includes(new Date().getDay()) && (
                        <Badge variant="green" dot>Available today</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Booking panel */}
        {selectedDoctor && (
          <div className="card p-5 h-fit space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name={selectedDoctor.name} size="md" />
              <div>
                <p className="font-semibold text-slate-900 text-sm">{selectedDoctor.name}</p>
                <p className="text-xs text-slate-400">{selectedDoctor.specialization}</p>
              </div>
            </div>
            <div className="divider" />
            <div>
              <label className="label-base">Select Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="input-base"
              />
            </div>
            {selectedDate && (
              <div>
                <label className="label-base">Available Slots</label>
                {slotsLoading ? (
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-8 rounded-lg" />)}
                  </div>
                ) : !slots?.length ? (
                  <p className="text-xs text-slate-400">No slots available</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map(slot => {
                      const slotLabel = `${slot.startTime} - ${slot.endTime}`;
                      return (
                        <button
                          key={slotLabel}
                          disabled={slot.isBooked}
                          onClick={() => setSelectedSlot(slotLabel)}
                          className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                            slot.isBooked 
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : selectedSlot === slotLabel 
                              ? 'bg-primary-600 text-white border-primary-600' 
                              : 'border-surface-200 text-slate-600 hover:border-primary-400'
                          }`}
                        >
                          {slotLabel}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            <div>
              <label className="label-base">Reason for visit</label>
              <textarea
                rows={3}
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Briefly describe your symptoms…"
                className="input-base resize-none"
              />
            </div>
            <Button
              className="w-full justify-center"
              disabled={!selectedSlot || !reason.trim()}
              loading={book.isPending}
              onClick={handleBooking}
            >
              <Calendar className="w-4 h-4" /> Confirm Booking
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}