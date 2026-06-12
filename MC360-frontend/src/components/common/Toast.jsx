// Re-export from react-hot-toast for convenience
export { toast as Toast, Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'

export const showToast = {
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  loading: (msg) => toast.loading(msg),
  dismiss: (id) => toast.dismiss(id),
}

export default showToast