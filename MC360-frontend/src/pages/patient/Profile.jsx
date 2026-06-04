import { useState } from 'react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Avatar from '../../components/common/Avatar'

export default function Profile() {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: 'Shivam Kumar', email: 'shivam@email.com', phone: '9876543210',
    dob: '1998-05-15', gender: 'Male', bloodGroup: 'B+', address: 'New Delhi, India',
  })

  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <h1 className="text-2xl font-display font-bold text-slate-800">My Profile</h1>

      <Card className="flex items-center gap-5">
        <Avatar name={form.name} size="xl" />
        <div>
          <h2 className="font-display font-bold text-xl text-slate-800">{form.name}</h2>
          <p className="text-slate-400 text-sm">{form.email}</p>
          <Button variant="secondary" size="sm" className="mt-2">Change Photo</Button>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-slate-800">Personal Information</h3>
          <Button variant="secondary" size="sm" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'Full Name',    name: 'name',       type: 'text' },
            { label: 'Email',        name: 'email',      type: 'email' },
            { label: 'Phone',        name: 'phone',      type: 'tel' },
            { label: 'Date of Birth', name: 'dob',       type: 'date' },
            { label: 'Gender',       name: 'gender',     type: 'text' },
            { label: 'Blood Group',  name: 'bloodGroup', type: 'text' },
          ].map(({ label, name, type }) => (
            <Input key={name} label={label} name={name} type={type}
              value={form[name]} onChange={change} disabled={!editing} />
          ))}
          <div className="sm:col-span-2">
            <Input label="Address" name="address" value={form.address} onChange={change} disabled={!editing} />
          </div>
        </div>
        {editing && <Button className="w-full" onClick={() => setEditing(false)}>Save Changes</Button>}
      </Card>
    </div>
  )
}