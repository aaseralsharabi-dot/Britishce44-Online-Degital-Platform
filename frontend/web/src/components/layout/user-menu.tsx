'use client'

import { useState } from 'react'

interface UserMenuProps {
  user: { firstName: string; lastName: string; role: string } | null
  onLogout: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 hover:border-gold/50 hover:bg-white/5 transition text-white text-sm"
      >
        <div className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center text-xs font-bold text-gold">
          {user.firstName[0]}{user.lastName[0]}
        </div>
        <span className="hidden sm:inline text-xs">{user.firstName}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-navy to-royal-blue">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-navy font-bold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{user.firstName} {user.lastName}</p>
                <p className="text-gold text-xs">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </p>
              </div>
            </div>
          </div>
          <div className="p-2">
            <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-navy hover:bg-gold/10 transition flex items-center gap-2">
              <span>👤</span> My Profile
            </button>
            <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-navy hover:bg-gold/10 transition flex items-center gap-2">
              <span>⚙️</span> Settings
            </button>
            <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-navy hover:bg-gold/10 transition flex items-center gap-2">
              <span>🔔</span> Preferences
            </button>
            <div className="border-t border-gray-200 my-2" />
            <button
              onClick={() => {
                setIsOpen(false)
                onLogout()
              }}
              className="w-full text-left px-4 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition flex items-center gap-2"
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
