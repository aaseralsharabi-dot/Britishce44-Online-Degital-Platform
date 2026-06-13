/**
 * Real-time Notifications System
 * - WebSocket connection management
 * - Notification queue
 * - Persistence and retrieval
 */

import { io, Socket } from 'socket.io-client'

export interface NotificationPayload {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  actionUrl?: string
  actionLabel?: string
  read: boolean
  createdAt: string
}

class NotificationService {
  private socket: Socket | null = null
  private wsUrl: string
  private listeners: Map<string, Set<(data: any) => void>> = new Map()
  private notificationQueue: NotificationPayload[] = []

  constructor() {
    this.wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3002'
  }

  /**
   * Connect to notification service
   */
  connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(this.wsUrl, {
          query: { userId },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        })

        this.socket.on('connect', () => {
          console.log('[Notifications] Connected to notification service')
          resolve()
        })

        this.socket.on('notification', (data: NotificationPayload) => {
          this.handleNotification(data)
        })

        this.socket.on('disconnect', () => {
          console.log('[Notifications] Disconnected from notification service')
        })

        this.socket.on('error', (error: any) => {
          console.error('[Notifications] Error:', error)
          reject(error)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Disconnect from notification service
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  /**
   * Handle incoming notification
   */
  private handleNotification(notification: NotificationPayload): void {
    this.notificationQueue.push(notification)

    // Persist to localStorage
    this.persistNotification(notification)

    // Trigger listeners
    this.emit('notification', notification)
  }

  /**
   * Subscribe to notification events
   */
  subscribe(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }

    this.listeners.get(event)!.add(callback)

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback)
    }
  }

  /**
   * Emit event to listeners
   */
  private emit(event: string, data: any): void {
    this.listeners.get(event)?.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`[Notifications] Error in listener for ${event}:`, error)
      }
    })
  }

  /**
   * Persist notification to localStorage
   */
  private persistNotification(notification: NotificationPayload): void {
    try {
      const stored = localStorage.getItem('notifications')
      const notifications = stored ? JSON.parse(stored) : []
      notifications.push(notification)

      // Keep only last 50 notifications
      if (notifications.length > 50) {
        notifications.shift()
      }

      localStorage.setItem('notifications', JSON.stringify(notifications))
    } catch (error) {
      console.error('[Notifications] Failed to persist notification:', error)
    }
  }

  /**
   * Get persisted notifications
   */
  getPersistedNotifications(): NotificationPayload[] {
    try {
      const stored = localStorage.getItem('notifications')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('[Notifications] Failed to retrieve persisted notifications:', error)
      return []
    }
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    if (this.socket) {
      this.socket.emit('mark-as-read', { notificationId })
    }
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    localStorage.removeItem('notifications')
    this.notificationQueue = []
  }

  /**
   * Get unread count
   */
  getUnreadCount(): number {
    const notifications = this.getPersistedNotifications()
    return notifications.filter(n => !n.read).length
  }
}

export const notificationService = new NotificationService()
