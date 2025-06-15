import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder').catch(err => {
  console.warn('Stripe initialization failed:', err)
  return null
})

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full text-center text-white">
            <div className="text-6xl mb-4">🚨</div>
            <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
            <p className="text-white/80 mb-6">
              We're sorry, but something unexpected happened. Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Refresh Page
            </button>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-red-300 mb-2">
                  Error Details (Development)
                </summary>
                <pre className="bg-red-900/20 p-4 rounded text-sm overflow-auto text-red-200">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Performance monitoring
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function && import.meta.env.DEV) {
    // Simple performance logging for development
    if ('performance' in window) {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0]
        onPerfEntry({
          name: 'page-load',
          value: perfData.loadEventEnd - perfData.loadEventStart
        })
      }, 0)
    }
  }
}

// Initialize React App
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Elements stripe={stripePromise}>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#1a1a1a',
                fontWeight: '500',
                padding: '16px',
                fontSize: '14px',
                maxWidth: '400px',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#FFFFFF',
                },
                style: {
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#FFFFFF',
                },
                style: {
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                },
              },
              loading: {
                iconTheme: {
                  primary: '#667eea',
                  secondary: '#FFFFFF',
                },
                style: {
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                },
              },
            }}
          />
        </Elements>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)

// Report web vitals in development
if (import.meta.env.DEV) {
  reportWebVitals(console.log)
}

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
})

// Export for testing
export default root