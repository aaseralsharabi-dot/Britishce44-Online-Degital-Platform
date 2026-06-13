/**
 * Performance Optimization Utilities
 * - Request debouncing and throttling
 * - Memory management
 * - Performance monitoring
 */

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Performance monitoring
 */
export function measurePerformance(label: string, fn: () => Promise<void>) {
  return async () => {
    const start = performance.now()
    try {
      await fn()
      const end = performance.now()
      const duration = end - start
      console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`)

      // Report to analytics in production
      if (process.env.NODE_ENV === 'production') {
        // Send to analytics service
        console.log(`[Analytics] ${label} took ${duration}ms`)
      }
    } catch (error) {
      console.error(`[Performance] ${label} failed:`, error)
    }
  }
}

/**
 * Memory leak detection
 */
let componentMountCount = 0
let componentUnmountCount = 0

export function trackComponentMount(componentName: string) {
  componentMountCount++
  console.log(`[Memory] Component mounted: ${componentName} (Total: ${componentMountCount})`)
}

export function trackComponentUnmount(componentName: string) {
  componentUnmountCount++
  console.log(
    `[Memory] Component unmounted: ${componentName} (Total: ${componentUnmountCount}, Diff: ${componentMountCount - componentUnmountCount})`
  )

  // Alert if potential memory leak detected
  if (componentMountCount - componentUnmountCount > 10) {
    console.warn('[Memory] Potential memory leak detected!')
  }
}

/**
 * Request cancellation for cleanup
 */
export function createAbortController() {
  return new AbortController()
}

/**
 * Bundle size analysis hint
 */
export function checkBundleSize() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.info('[Build] Bundle size check: Use `next build && next-bundle-analyzer` to analyze')
  }
}
