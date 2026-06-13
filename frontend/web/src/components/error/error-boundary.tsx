'use client'

import { ReactNode, Component } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: any
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('[ErrorBoundary] Error caught:', error, errorInfo)
    this.setState({ errorInfo })

    // Log to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // Send to Sentry, LogRocket, etc.
      console.error('[ErrorTracking] Error reported:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="max-w-md w-full">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-navy text-center mb-2">Something went wrong</h2>
                <p className="text-sm text-gray-600 text-center mb-4">
                  {this.state.error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
                </p>
                {process.env.NODE_ENV === 'development' && (
                  <details className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-700">
                    <summary className="cursor-pointer font-bold mb-2">Error Details</summary>
                    <pre className="overflow-auto whitespace-pre-wrap break-words">
                      {this.state.error?.toString()}
                    </pre>
                  </details>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="flex-1 btn btn-primary"
                  >
                    Refresh Page
                  </button>
                  <button
                    onClick={() => window.history.back()}
                    className="flex-1 btn btn-secondary"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}

/**
 * Centralized logging utility
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private logHistory: Array<{ timestamp: string; level: LogLevel; message: string; data?: any }> = []
  private maxHistorySize = 100

  private getTimestamp(): string {
    return new Date().toISOString()
  }

  private addToHistory(level: LogLevel, message: string, data?: any) {
    this.logHistory.push({
      timestamp: this.getTimestamp(),
      level,
      message,
      data,
    })

    // Keep history size manageable
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift()
    }
  }

  debug(message: string, data?: any) {
    if (this.isDevelopment) {
      console.debug(`[${LogLevel.DEBUG}] ${message}`, data)
      this.addToHistory(LogLevel.DEBUG, message, data)
    }
  }

  info(message: string, data?: any) {
    console.info(`[${LogLevel.INFO}] ${message}`, data)
    this.addToHistory(LogLevel.INFO, message, data)
  }

  warn(message: string, data?: any) {
    console.warn(`[${LogLevel.WARN}] ${message}`, data)
    this.addToHistory(LogLevel.WARN, message, data)
  }

  error(message: string, error?: any) {
    console.error(`[${LogLevel.ERROR}] ${message}`, error)
    this.addToHistory(LogLevel.ERROR, message, error)

    // Send to error tracking service
    if (!this.isDevelopment && error) {
      this.reportError(message, error)
    }
  }

  private reportError(message: string, error: any) {
    // Placeholder for error reporting to external service
    // In production, integrate with Sentry, LogRocket, or similar
    try {
      // Example: Send to error tracking service
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     message,
      //     error: error.toString(),
      //     stack: error.stack,
      //     timestamp: new Date().toISOString(),
      //   }),
      // })
    } catch (err) {
      console.error('[Logger] Failed to report error:', err)
    }
  }

  getHistory() {
    return this.logHistory
  }

  clearHistory() {
    this.logHistory = []
  }

  exportLogs(): string {
    return JSON.stringify(this.logHistory, null, 2)
  }
}

export const logger = new Logger()
