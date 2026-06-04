import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/index.jsx'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
import EmergencyAlertBanner from './components/emergency/EmergencyAlertBanner.jsx'

export default function App() {
  return (
    <BrowserRouter>
      {/* 1. Global layout elements that should NEVER crash or disappear */}
      <EmergencyAlertBanner />
      
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-sm font-medium',
          duration: 4000,
          style: {
            borderRadius: '12px',
            boxShadow: '0 4px 24px -4px rgb(0 0 0 / 0.12)',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      {/* 2. Wrap only the routing/pages in the ErrorBoundary */}
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </BrowserRouter>
  )
}