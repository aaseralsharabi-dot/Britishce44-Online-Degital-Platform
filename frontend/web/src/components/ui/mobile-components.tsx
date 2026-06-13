'use client'

import { useState } from 'react'
import { PageKey } from './dashboard-layout'

interface MobileNavProps {
  currentPage: PageKey
  onNavigate: (page: PageKey) => void
  unreadCount?: number
}

const quickLinks: Array<{ page: PageKey; icon: string; label: string }> = [
  { page: 'dashboard', icon: '🏠', label: 'Home' },
  { page: 'classrooms', icon: '🚪', label: 'Classes' },
  { page: 'ce4messenger', icon: '💬', label: 'Messages' },
  { page: 'homework', icon: '📄', label: 'Work' },
]

export function MobileBottomNav({ currentPage, onNavigate, unreadCount = 0 }: MobileNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex items-center justify-around h-16">
        {quickLinks.map(link => (
          <button
            key={link.page}
            onClick={() => onNavigate(link.page)}
            className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
              currentPage === link.page
                ? 'text-gold border-t-2 border-gold'
                : 'text-gray-600 hover:text-gold'
            }`}
          >
            <span className="text-xl">{link.icon}</span>
            <span className="text-xs mt-0.5 font-medium">{link.label}</span>
            {link.page === 'ce4messenger' && unreadCount > 0 && (
              <span className="absolute top-1 right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}

/**
 * Mobile-optimized drawer component
 */
interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function MobileDrawer({ isOpen, onClose, children, title }: MobileDrawerProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed right-0 top-0 bottom-0 w-72 bg-white shadow-2xl z-40 transform transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-navy">{title || 'Menu'}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-navy transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto h-full">{children}</div>
      </div>
    </>
  )
}

/**
 * Mobile-optimized card
 */
interface MobileCardProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function MobileCard({ children, onClick, className = '' }: MobileCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg border border-gray-200 p-4 shadow-sm
        ${onClick ? 'cursor-pointer active:bg-gray-50' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

/**
 * Mobile-optimized button
 */
interface MobileButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function MobileButton({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
}: MobileButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'w-full px-4 py-3 text-base',
  }

  const variantClasses = {
    primary: 'bg-gold text-navy hover:bg-gold-dark',
    secondary: 'bg-gray-200 text-navy hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        font-semibold rounded-lg transition-colors active:scale-95
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  )
}

/**
 * Mobile-optimized input
 */
interface MobileInputProps {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  disabled?: boolean
  className?: string
}

export function MobileInput({
  placeholder,
  value,
  onChange,
  type = 'text',
  disabled = false,
  className = '',
}: MobileInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`
        w-full px-4 py-3 border border-gray-300 rounded-lg text-base
        focus:ring-2 focus:ring-gold focus:border-transparent outline-none
        ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
        ${className}
      `}
    />
  )
}
