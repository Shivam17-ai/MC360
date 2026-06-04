export default function Avatar({ src, name = '', size = 'md', className = '' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base', xl: 'w-20 h-20 text-xl' }
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  if (src) {
    return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ${className}`} />
  }
  return (
    <div className={`${sizes[size]} rounded-full bg-primary-100 text-primary-700 font-semibold flex items-center justify-center ${className}`}>
      {initials || '?'}
    </div>
  )
}