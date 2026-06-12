import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useDebounce } from '../../hooks/useDebounce'
import { clsx } from 'clsx'

export default function SearchBar({ onSearch, placeholder = 'Search…', className = '' }) {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 400)

  const handleChange = (e) => {
    setValue(e.target.value)
    onSearch(debouncedValue)
  }

  return (
    <div className={clsx('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="input-base pl-9 pr-9"
      />
      {value && (
        <button
          onClick={() => { setValue(''); onSearch('') }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}