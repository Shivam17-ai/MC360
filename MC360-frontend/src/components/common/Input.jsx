export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <input className={`input ${error ? 'border-red-400 focus:ring-red-400' : ''} ${className}`} {...props} />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}