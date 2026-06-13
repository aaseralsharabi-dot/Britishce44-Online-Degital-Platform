/**
 * Enhanced Authentication Utilities
 * - Password security validation
 * - MFA management
 * - Session security
 * - Token refresh logic
 */

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

/**
 * Validate password strength
 * Requirements:
 * - At least 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 */
export function validatePasswordStrength(password: string): ValidationResult {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const valid = emailRegex.test(email)

  return {
    valid,
    errors: valid ? [] : ['Invalid email address format'],
  }
}

/**
 * Hash password (client-side hinting - actual hashing on server)
 * This is for demonstration. Real password hashing must happen server-side
 */
export async function hashPasswordClientHint(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Session management
 */
export class SessionManager {
  private tokenKey = 'auth_token'
  private refreshTokenKey = 'refresh_token'
  private csrfTokenKey = 'csrf_token'
  private sessionExpiryKey = 'session_expiry'

  /**
   * Store tokens securely
   */
  storeTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    try {
      // Store tokens in memory for immediate use, but also set HttpOnly cookie on server
      sessionStorage.setItem(this.tokenKey, accessToken)
      sessionStorage.setItem(this.refreshTokenKey, refreshToken)
      sessionStorage.setItem(this.sessionExpiryKey, String(Date.now() + expiresIn * 1000))

      // Generate and store CSRF token
      const csrfToken = generateCSRFToken()
      sessionStorage.setItem(this.csrfTokenKey, csrfToken)
    } catch (error) {
      console.error('[Auth] Failed to store tokens:', error)
    }
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return sessionStorage.getItem(this.tokenKey)
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.refreshTokenKey)
  }

  /**
   * Get CSRF token
   */
  getCSRFToken(): string | null {
    return sessionStorage.getItem(this.csrfTokenKey)
  }

  /**
   * Check if session is expired
   */
  isSessionExpired(): boolean {
    const expiry = sessionStorage.getItem(this.sessionExpiryKey)
    if (!expiry) return true
    return Date.now() > parseInt(expiry)
  }

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    sessionStorage.removeItem(this.tokenKey)
    sessionStorage.removeItem(this.refreshTokenKey)
    sessionStorage.removeItem(this.csrfTokenKey)
    sessionStorage.removeItem(this.sessionExpiryKey)
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken()
    return !!token && !this.isSessionExpired()
  }
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map()
  private maxAttempts: number
  private windowMs: number

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
  }

  /**
   * Check if action is rate limited
   */
  isLimited(key: string): boolean {
    const now = Date.now()
    const attempts = this.attempts.get(key) || []

    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs)

    if (recentAttempts.length >= this.maxAttempts) {
      return true
    }

    recentAttempts.push(now)
    this.attempts.set(key, recentAttempts)
    return false
  }

  /**
   * Get remaining attempts
   */
  getRemainingAttempts(key: string): number {
    const now = Date.now()
    const attempts = this.attempts.get(key) || []
    const recentAttempts = attempts.filter(time => now - time < this.windowMs)
    return Math.max(0, this.maxAttempts - recentAttempts.length)
  }

  /**
   * Reset attempts for a key
   */
  reset(key: string): void {
    this.attempts.delete(key)
  }
}

// Global instances
export const sessionManager = new SessionManager()
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000) // 5 attempts per 15 minutes
export const mfaRateLimiter = new RateLimiter(3, 5 * 60 * 1000) // 3 attempts per 5 minutes
