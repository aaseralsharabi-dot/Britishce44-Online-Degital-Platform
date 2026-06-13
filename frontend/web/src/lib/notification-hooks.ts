'use client'

import React, { useEffect, useCallback, useRef } from 'react'
import { notificationService, type NotificationPayload } from '@/lib/notification-service'

/**
 * Hook for managing real-time notifications
 */
export function useNotifications(userId?: string) {
  const unsubscribeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!userId) return

    // Connect to notification service
    notificationService.connect(userId).catch(error => {
      console.error('[Notifications] Failed to connect:', error)
    })

    // Subscribe to notifications
    unsubscribeRef.current = notificationService.subscribe('notification', (notification: NotificationPayload) => {
      console.log('[Notifications] Received:', notification)
    })

    return () => {
      // Cleanup
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
      notificationService.disconnect()
    }
  }, [userId])

  const markAsRead = useCallback((notificationId: string) => {
    notificationService.markAsRead(notificationId)
  }, [])

  const getUnreadCount = useCallback(() => {
    return notificationService.getUnreadCount()
  }, [])

  return {
    markAsRead,
    getUnreadCount,
  }
}

/**
 * Hook for real-time event streaming
 */
export function useEventStream(eventType: string, callback: (event: any) => void) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(eventType, (event: any) => {
      callbackRef.current(event)
    })

    return () => {
      unsubscribe()
    }
  }, [eventType])
}

/**
 * Hook for WebSocket connection status
 */
export function useConnectionStatus() {
  const [isConnected, setIsConnected] = React.useState(false)

  useEffect(() => {
    const unsubscribeConnect = notificationService.subscribe('connect', () => {
      setIsConnected(true)
      console.log('[WebSocket] Connected')
    })

    const unsubscribeDisconnect = notificationService.subscribe('disconnect', () => {
      setIsConnected(false)
      console.log('[WebSocket] Disconnected')
    })

    return () => {
      unsubscribeConnect()
      unsubscribeDisconnect()
    }
  }, [])

  return { isConnected }
}
