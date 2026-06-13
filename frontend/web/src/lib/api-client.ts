/**
 * API Interceptor for Security & Request Management
 * - Auto token injection
 * - CSRF token handling
 * - Error handling & retries
 * - Request/Response logging
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import { sessionManager } from './auth-utils'

class APIClient {
  private client: AxiosInstance
  private baseURL: string

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api') {
    this.baseURL = baseURL

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })

    // Request interceptor
    this.client.interceptors.request.use(
      config => {
        const token = sessionManager.getAccessToken()
        const csrfToken = sessionManager.getCSRFToken()

        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`
        }

        if (csrfToken) {
          config.headers['X-CSRF-Token'] = csrfToken
        }

        config.headers['X-Requested-With'] = 'XMLHttpRequest'

        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      error => {
        console.error('[API] Request error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      response => {
        console.log(`[API] Response: ${response.status} ${response.statusText}`)
        return response
      },
      async error => {
        const originalRequest = error.config

        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = sessionManager.getRefreshToken()
            if (refreshToken) {
              // Attempt to refresh token
              console.log('[API] Attempting token refresh...')
              const response = await axios.post(`${this.baseURL}/auth/refresh`, {
                refreshToken,
              })

              const { accessToken, expiresIn } = response.data
              sessionManager.storeTokens(accessToken, refreshToken, expiresIn)

              // Retry original request
              originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
              return this.client(originalRequest)
            }
          } catch (refreshError) {
            console.error('[API] Token refresh failed:', refreshError)
            sessionManager.clearTokens()
            // Redirect to login
            window.location.href = '/login'
            return Promise.reject(refreshError)
          }
        }

        // Handle 403 Forbidden - CSRF token issue
        if (error.response?.status === 403) {
          console.error('[API] CSRF validation failed or forbidden')
        }

        // Handle 429 Too Many Requests
        if (error.response?.status === 429) {
          console.warn('[API] Rate limited. Please try again later')
        }

        // Log error
        console.error(
          `[API] Error: ${error.response?.status} ${error.response?.statusText || error.message}`,
          error.response?.data
        )

        return Promise.reject(error)
      }
    )
  }

  /**
   * GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.get<T>(url, config)
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.post<T>(url, data, config)
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.put<T>(url, data, config)
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.patch<T>(url, data, config)
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.delete<T>(url, config)
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any) {
    if (error instanceof AxiosError) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message

      switch (status) {
        case 400:
          console.error('[API] Bad request:', message)
          break
        case 401:
          console.error('[API] Unauthorized:', message)
          break
        case 403:
          console.error('[API] Forbidden:', message)
          break
        case 404:
          console.error('[API] Not found:', message)
          break
        case 500:
          console.error('[API] Server error:', message)
          break
        default:
          console.error('[API] Error:', message)
      }
    }
  }

  /**
   * Get axios instance for advanced usage
   */
  getClient(): AxiosInstance {
    return this.client
  }
}

export const apiClient = new APIClient()
