import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/index.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-sm font-medium',
          duration: 4000,
          style: {
            borderRadius: '12px',
            boxShadow: '0 4px 24px -4px rgb(0 0 0 / 0.12)',
          },
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  )
}
