import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
}

const sizes = {
  sm: 'px-3.5 py-1.5 text-xs',
  md: '',
  lg: 'px-6 py-3 text-base',
}

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(variants[variant], sizes[size], className)}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : leftIcon ? (
        <span className="w-4 h-4">{leftIcon}</span>
      ) : null}
      {children}
      {!loading && rightIcon && <span className="w-4 h-4">{rightIcon}</span>}
    </button>
  )
})

Button.displayName = 'Button'
export default Button