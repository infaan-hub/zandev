import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[200px] flex flex-col items-center justify-center p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <span className="text-red-400 text-xl">!</span>
          </div>
          <h3 className="text-white text-sm font-semibold mb-1">Something went wrong</h3>
          <p className="text-[#666] text-xs mb-4 max-w-[300px]">{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })} className="px-4 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:-translate-y-0.5 transition-transform">
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
