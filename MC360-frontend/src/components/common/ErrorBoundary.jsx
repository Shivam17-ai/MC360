import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-display font-bold text-slate-800">Something went wrong</h2>
            <p className="text-slate-500">Please refresh the page and try again.</p>
            <button className="btn-primary" onClick={() => window.location.reload()}>Refresh</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}