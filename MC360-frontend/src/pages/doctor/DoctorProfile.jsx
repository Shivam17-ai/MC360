import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'
import { User, Phone, Clock, Award, Camera } from 'lucide-react'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Avatar from '../../components/common/Avatar'
import Badge from '../../components/common/Badge'
import toast from 'react-hot-toast'
import { SPECIALIZATIONS } from '../../utils/constants'

export default function DoctorProfile() {
  const { user, updateUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [doctorData, setDoctorData] = useState(null)
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    specialization: '',
    experience: '',
    qualification: '',
    consultationFee: '',
    bio: '',
    weekendAvailability: false,
  })

  // Fetch doctor profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await authService.getDoctorProfile()
        const doctor = res.data.doctor
        setDoctorData(doctor)
        setForm(p => ({
          ...p,
          specialization: doctor.specialization || '',
          experience: doctor.experience || '',
          qualification: doctor.qualifications?.[0] || '',
          consultationFee: doctor.consultationFee || '',
          bio: doctor.biography || '',
          weekendAvailability: doctor.weekendAvailability || false,
        }))
      } catch (e) {
        console.error('Failed to load doctor profile:', e)
      }
    }
    loadProfile()
  }, [])

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const handleToggleWeekend = () => setForm(p => ({ ...p, weekendAvailability: !p.weekendAvailability }))

  const handleSave = async () => {
    setLoading(true)
    try {
      // Update user fields (name, phone)
      const userUpdates = {
        name: form.name,
        phone: form.phone,
      }
      
      // Update doctor fields (specialization, experience, etc.)
      const doctorUpdates = {
        specialization: form.specialization,
        experience: parseInt(form.experience) || 0,
        qualifications: form.qualification ? [form.qualification] : [],
        consultationFee: parseFloat(form.consultationFee) || 0,
        biography: form.bio,
        weekendAvailability: form.weekendAvailability,
      }

      // Save both in parallel
      await Promise.all([
        authService.updateProfile(userUpdates).catch(e => {
          if (e.response?.status !== 400) throw e; // Ignore minor errors
        }),
        authService.updateDoctorProfile(doctorUpdates)
      ])

      updateUser({ ...user, ...userUpdates })
      setDoctorData({ ...doctorData, ...doctorUpdates })
      toast.success('Profile updated successfully')
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const res = await import('./../../services/api').then(m =>
        m.default.put('/auth/me', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      )
      const newAvatar = res?.data?.user?.avatar || res?.user?.avatar
      if (newAvatar) updateUser({ ...user, avatar: newAvatar })
      toast.success('Profile photo updated!')
    } catch (e) {
      toast.error('Failed to upload photo')
    } finally {
      setAvatarUploading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="section-title">Doctor Profile</h1>
        <p className="section-subtitle">Manage your professional profile</p>
      </div>

      <div className="card p-6 flex items-center gap-5">
        <div className="relative">
          <Avatar name={user?.name} src={user?.avatar} size="xl" />
          <button
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center border-2 border-white disabled:opacity-50"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarUploading}
            title="Change profile photo"
          >
            <Camera className="w-3.5 h-3.5 text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{user?.name}</h2>
          <p className="text-sm text-slate-500">{user?.email}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="blue">Doctor</Badge>
            {form.specialization && <Badge variant="gray">{form.specialization}</Badge>}
          </div>
        </div>
      </div>

      <div className="card p-6 space-y-5">
        <h3 className="font-semibold text-slate-900">Professional Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Full Name" name="name" value={form.name} onChange={handleChange} leftIcon={<User className="w-4 h-4" />} />
          <Input label="Mobile" name="phone" value={form.phone} onChange={handleChange} leftIcon={<Phone className="w-4 h-4" />} />
          <div>
            <label className="label-base">Specialization</label>
            <select name="specialization" value={form.specialization} onChange={handleChange} className="input-base">
              <option value="">Select specialization</option>
              {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Input label="Experience (years)" name="experience" type="number" value={form.experience} onChange={handleChange} leftIcon={<Clock className="w-4 h-4" />} />
          <Input label="Qualification" name="qualification" value={form.qualification} onChange={handleChange} leftIcon={<Award className="w-4 h-4" />} placeholder="e.g. MBBS, MD" />
          <Input label="Consultation Fee (₹)" name="consultationFee" type="number" value={form.consultationFee} onChange={handleChange} />
        </div>

        {/* Weekend Availability Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <label className="text-sm font-semibold text-slate-800 block">Weekend Availability</label>
            <span className="text-xs text-slate-500">Allow patients to book appointments on Saturdays and Sundays.</span>
          </div>
          <button
            type="button"
            onClick={handleToggleWeekend}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${form.weekendAvailability ? 'bg-primary-600' : 'bg-slate-200'}`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${form.weekendAvailability ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
        </div>
        <div>
          <label className="label-base">Bio</label>
          <textarea name="bio" rows={3} value={form.bio} onChange={handleChange} className="input-base resize-none" placeholder="Brief professional description…" />
        </div>
        <div className="flex justify-end">
          <Button loading={loading} onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  )
}