import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../../utils/validators'
import Input from '../common/Input'
import Button from '../common/Button'
import { User, Mail, Phone, Lock } from 'lucide-react'

export default function RegisterForm({ onSubmit, isLoading, onRoleChange }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'patient' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Full name" placeholder="Dr. Jane Smith" leftIcon={<User className="w-4 h-4" />} error={errors.name?.message} {...register('name')} />
      <Input label="Email" type="email" placeholder="you@example.com" leftIcon={<Mail className="w-4 h-4" />} error={errors.email?.message} {...register('email')} />
      <Input label="Mobile number" type="tel" placeholder="9876543210" leftIcon={<Phone className="w-4 h-4" />} error={errors.phone?.message} {...register('phone')} />
      <Input label="Password" type="password" placeholder="Create a strong password" leftIcon={<Lock className="w-4 h-4" />} error={errors.password?.message} {...register('password')} />
      <div>
        <label className="label-base">I am a</label>
        <div className="grid grid-cols-3 gap-2">
          {[{ value: 'patient', label: 'Patient' }, { value: 'doctor', label: 'Doctor' }, { value: 'hospital', label: 'Hospital' }].map((opt) => (
            <label key={opt.value} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-surface-200 cursor-pointer hover:border-primary-400 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 transition-all">
              <input
                type="radio"
                value={opt.value}
                {...register('role')}
                onChange={(e) => {
                  register('role').onChange(e)
                  onRoleChange?.(e.target.value)
                }}
                className="sr-only"
              />
              <span className="text-sm font-medium text-slate-700">{opt.label}</span>
            </label>
          ))}
        </div>
        {errors.role && <p className="mt-1.5 text-xs text-red-500">{errors.role.message}</p>}
      </div>
      <Button type="submit" loading={isLoading} className="w-full justify-center mt-2">
        Create account
      </Button>
    </form>
  )
}