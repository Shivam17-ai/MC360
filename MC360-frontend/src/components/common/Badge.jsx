export default function Badge({ children, variant = 'blue', className = '' }) {
  const variants = {
    blue: 'badge-blue',
    green: 'badge-green',
    red: 'badge-red',
    amber: 'badge-amber',
    slate: 'badge-slate',
  }
  return <span className={`${variants[variant]} ${className}`}>{children}</span>
}