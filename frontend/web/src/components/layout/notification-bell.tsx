'use client'

import { useState, useEffect } from 'react'

interface Notification {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    // Mock notifications - in production, connect to real-time service
    setNotifications([
      {
        id: '1',
        message: 'New assignment posted in Math class',
        type: 'info',
        timestamp: new Date(Date.now() - 5 * 60000),
        read: false,
      },
      {
        id: '2',
        message: 'Your exam results are ready',
        type: 'success',
        timestamp: new Date(Date.now() - 30 * 60000),
        read: false,
      },
    ])
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return '✓'
      case 'warning': return '⚠'
      case 'error': return '✕'
      default: return 'ℹ'
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-white/60 hover:text-gold p-2 rounded-full hover:bg-white/10 transition"
        aria-label="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 sticky top-0 bg-gray-50">
            <h3 className="font-bold text-navy">Notifications</h3>
          </div>
          <div className="divide-y">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No notifications yet</div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-3 cursor-pointer hover:bg-gray-50 transition ${
                    !notif.read ? 'bg-gold/5' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <span className={`text-lg flex-shrink-0 ${
                      notif.type === 'success' ? 'text-green-500' :
                      notif.type === 'warning' ? 'text-yellow-500' :
                      notif.type === 'error' ? 'text-red-500' : 'text-blue-500'
                    }`}>
                      {getIcon(notif.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-navy font-medium">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {Math.round((Date.now() - notif.timestamp.getTime()) / 60000)} min ago
                      </p>
                    </div>
                    {!notif.read && <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0 mt-2" />}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
