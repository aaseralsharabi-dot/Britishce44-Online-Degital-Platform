'use client'

import { NotificationBell } from './notification-bell'
import { UserMenu } from './user-menu'

interface TopBarProps {
  user: { firstName: string; lastName: string; role: string } | null
  onLogout: () => void
  onToggleSidebar: () => void
}

export function TopBar({ user, onLogout, onToggleSidebar }: TopBarProps) {
  return (
    <header className="h-16 navy-gradient flex items-center justify-between px-3 md:px-6 flex-shrink-0 z-30 shadow-lg border-b border-white/5">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-lg transition"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-navy font-black text-xs">B</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm">Britishce44</span>
          <span className="text-champagne/50 text-[10px]">Digital Platform</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {user && (
          <>
            <NotificationBell />
            <UserMenu user={user} onLogout={onLogout} />
          </>
        )}
      </div>
    </header>
  )
}
