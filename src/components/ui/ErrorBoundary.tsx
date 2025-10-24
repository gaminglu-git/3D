'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: any
  isHydrationError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isHydrationError: false,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is a hydration error
    const isHydrationError =
      error.message?.includes('Hydration') ||
      error.message?.includes('hydration') ||
      error.message?.includes('did not match')

    return {
      hasError: true,
      error,
      errorInfo: null,
      isHydrationError,
    }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Log more details for debugging
    if (this.state.isHydrationError) {
      console.warn(
        'Hydration error detected. This may be caused by browser extensions or external scripts modifying the DOM.'
      )
    }

    this.setState({ errorInfo })
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isHydrationError: false,
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      const { error, isHydrationError } = this.state

      return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
          <div className="max-w-md rounded-xl bg-white p-8 text-center shadow-2xl">
            <div className="mb-4 flex justify-center">
              <div
                className={`rounded-full ${isHydrationError ? 'bg-yellow-100' : 'bg-red-100'} p-4`}
              >
                <AlertTriangle
                  className={`h-12 w-12 ${isHydrationError ? 'text-yellow-600' : 'text-red-600'}`}
                />
              </div>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              {isHydrationError ? 'Rendering-Problem erkannt' : 'Etwas ist schiefgelaufen'}
            </h1>
            <p className="mb-4 text-gray-600">
              {isHydrationError
                ? 'Die Seite konnte nicht korrekt geladen werden. Dies kann durch Browser-Erweiterungen verursacht werden.'
                : error?.message || 'Ein unerwarteter Fehler ist aufgetreten'}
            </p>

            {process.env.NODE_ENV === 'development' && error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Technische Details
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-gray-100 p-3 text-xs text-gray-700">
                  {error.stack || error.message}
                </pre>
              </details>
            )}

            <div className="flex justify-center gap-3">
              {isHydrationError && (
                <button
                  onClick={this.handleRetry}
                  className="flex items-center gap-2 rounded-lg bg-yellow-600 px-6 py-3 font-medium text-white transition-colors hover:bg-yellow-700"
                >
                  Erneut versuchen
                </button>
              )}
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700"
              >
                <RefreshCw className="h-5 w-5" />
                Seite neu laden
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
