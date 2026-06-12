import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'
import { User, Mail, Phone, Calendar, Droplets, Camera } from 'lucide-react'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Avatar from '../../components/common/Avatar'
import Badge from '../../components/common/Badge'
import toast from 'react-hot-toast'
import { BLOOD_GROUPS } from '../../utils/constants'

export default function PatientProfile() {
  const { user, updateUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [patientData, setPatientData] = useState(null)
  const fileInputRef = useRef(null)
  
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    dob: '',
    gender: '',
    bloodGroup: '',
    address: '',
    emergencyContact: '',
  })

  // Fetch patient profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await authService.getPatientProfile()
        const patient = res.data.patient
        setPatientData(patient)
        
        // Format date for input type="date" (YYYY-MM-DD)
        const dobFormatted = patient.dateOfBirth 
          ? new Date(patient.dateOfBirth).toISOString().split('T')[0] 
          : ''

        setForm(p => ({
          ...p,
          dob: dobFormatted,
          gender: patient.gender || '',
          bloodGroup: patient.bloodGroup || '',
          address: patient.address?.street || '',
          emergencyContact: patient.emergencyContact?.name || '',
        }))
      } catch (e) {
        console.error('Failed to load patient profile:', e)
      }
    }
    loadProfile()
  }, [])

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    setLoading(true)
    try {
      // 1. User updates (User model)
      const userUpdates = {
        name: form.name,
        phone: form.phone,
      }

      // 2. Patient updates (Patient model)
      const patientUpdates = {
        dateOfBirth: form.dob,
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        address: { street: form.address },
        emergencyContact: { name: form.emergencyContact }
      }

      await Promise.all([
        authService.updateProfile(userUpdates).catch(e => {
          if (e.response?.status !== 400) throw e
        }),
        authService.updatePatientProfile(patientUpdates)
      ])

      updateUser(userUpdates)
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
      if (newAvatar) updateUser({ avatar: newAvatar })
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
        <h1 className="section-title">My Profile</h1>
        <p className="section-subtitle">Update your personal and health information</p>
      </div>

      {/* Avatar */}
      <div className="card p-6 flex items-center gap-5">
        <div className="relative">
          <Avatar name={user?.name} src={user?.avatar} size="xl" />
          <button 
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center border-2 border-white disabled:opacity-50"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarUploading}
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
          <Badge variant="blue" className="mt-2 capitalize">{user?.role}</Badge>
        </div>
      </div>

      {/* Form */}
      <div className="card p-6 space-y-5">
        <h3 className="font-semibold text-slate-900">Personal Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Full Name" name="name" value={form.name} onChange={handleChange} leftIcon={<User className="w-4 h-4" />} />
          <Input label="Email" type="email" value={user?.email} disabled className="opacity-60" leftIcon={<Mail className="w-4 h-4" />} />
          <Input label="Mobile Number" name="phone" value={form.phone} onChange={handleChange} leftIcon={<Phone className="w-4 h-4" />} />
          <Input label="Date of Birth" type="date" name="dob" value={form.dob} onChange={handleChange} leftIcon={<Calendar className="w-4 h-4" />} />
          <div>
            <label className="label-base">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className="input-base">
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="label-base">Blood Group</label>
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="input-base">
              <option value="">Select blood group</option>
              {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <Input label="Emergency Contact" name="emergencyContact" value={form.emergencyContact} onChange={handleChange} placeholder="Name & phone number" />
        </div>
        <div>
          <label className="label-base">Address</label>
          <textarea name="address" rows={2} value={form.address} onChange={handleChange} className="input-base resize-none" placeholder="Your home address" />
        </div>
        <div className="flex justify-end">
          <Button loading={loading} onClick={handleSave}>Save Changes</Button>
        </div>
      </div>

      {/* Security */}
      <div className="card p-6 space-y-4">
        <h3 className="font-semibold text-slate-900">Security</h3>
        <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
          <div>
            <p className="text-sm font-medium text-slate-900">Password</p>
            <p className="text-xs text-slate-400">Manage your account security</p>
          </div>
          <Button variant="secondary" size="sm">Change Password</Button>
        </div>
      </div>
    </div>
  )
}